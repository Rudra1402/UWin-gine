import os
import argparse
from dotenv import load_dotenv
load_dotenv()

from langchain_postgres import PGVector
from langchain_openai import ChatOpenAI
from langchain_postgres.vectorstores import PGVector
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_experimental.text_splitter import SemanticChunker
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.chat_message_histories import SQLChatMessageHistory, ChatMessageHistory
from langchain_community.vectorstores import FAISS, PGEmbedding
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import BaseMessage, RemoveMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.postgres import PostgresSaver # type: ignore
from langgraph.graph import START, END, MessagesState, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict
from psycopg_pool import ConnectionPool
from typing import Sequence
import warnings
warnings.filterwarnings("ignore")

# We define a dict representing the state of the application.
# This state has the same input and output keys as `rag_chain`.
class State(TypedDict):
    input: str
    chat_history: Annotated[Sequence[BaseMessage], add_messages]
    context: str
    answer: str

class ChatModelQnA():
    
    def __init__(self) -> None:
        self._workflow = StateGraph(state_schema=State)
        # Define the (single) node in the graph
        self._workflow.add_node("filter", self._filter_messages)
        self._workflow.add_node("model", self._call_model)
        self._workflow.add_edge(START, "filter")
        self._workflow.add_edge("filter", "model")

        self._connection_kwargs = {
            "autocommit": True,
            "prepare_threshold": 0,
        }
            
        # memory = MemorySaver()
        # In the invocation process, _app can now handle config for personalized queries
        # self._app = self._workflow.compile(checkpointer=memory)
    
    def _filter_messages(self, state: State):
        # Delete all but the 6 most recent messages
        delete_messages = [RemoveMessage(id=m.id) for m in state["chat_history"][:-6]]
        print(delete_messages)
        print('Length of new list of messages: ', len(delete_messages))
        return {
            "chat_history": delete_messages,
            "input": state['input'],
            "answer": state['answer'],
            "context": state['context']
        }
        
    def _call_model(self, state: State, config: dict = None):
        # Use thread_id from config if provided
        thread_id = config.get("configurable", {}).get("thread_id", None)

        response = self._rag_chain.invoke(state)
        return {
            "chat_history": [
                HumanMessage(state["input"]),
                AIMessage(response["answer"]),
            ],
            "context": response["context"],
            "answer": response["answer"],
            "thread_id": thread_id  # Including thread_id in response if required
        }
    
    def _ask_query(self, chatMemoryConnectingString: str, input_text: str, config: dict = None):
        state = {
            "input": input_text,
            "chat_history": [],
            "context": "",
            "answer": ""
        }

        # Invoke _app with state and config for user-specific query handling
        with ConnectionPool(
            conninfo = chatMemoryConnectingString,
            max_size = 20,
            min_size = 1,
            timeout = 5000,
            kwargs=self._connection_kwargs
        ) as pool:
            cp = PostgresSaver(pool)
            cp.setup()
            self._app = self._workflow.compile(checkpointer=cp)
            return self._app.invoke(state, config=config)

    def _initialize_api(
            self, 
            key_groq: str, 
            key_hf: str):
        '''
            Assigns Groq and HF API key to an object variable

            Args:
                self: reference to object
                key: Groq API Key

            Returns: None
        '''
        self._groq_api_key = os.getenv(key=key_groq)
        self._hf_api_key = os.getenv(key=key_hf)
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_API_KEY"] = os.getenv(key="LANGCHAIN_API_KEY")
        os.environ["OPENAI_API_KEY"] = os.getenv(key="OPENAI_API_KEY")
        
    def _initialize_model(
            self, 
            model_name: str, 
            temperature: float,
            embedding_model_name: str):
        self._temperature = temperature
        # self._model_name = model_name
        self._model = ChatOpenAI(model="gpt-4o",temperature=self._temperature)
        # self._model = ChatGroq(model=self._model_name, groq_api_key=self._groq_api_key, temperature=self._temperature)
        self._embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name)
    
    def _initialize_retriever_chain(
            self,
            vector_store: PGVector
    ):
        self._vectorstore = vector_store
        self._retriever = self._vectorstore.as_retriever()

        # Contextualize question
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question "
            "which might reference context in the chat history, "
            "formulate a standalone question which can be understood "
            "without the chat history. Do NOT answer the question, "
            "just reformulate it if needed and otherwise return it as is."
        )

        contextualize_q_prompt = ChatPromptTemplate(
            [
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )

        self._history_aware_retriever = create_history_aware_retriever(self._model, self._retriever, contextualize_q_prompt)
        
        # Incorporate the history aware retriever into a question-answering chain.
        self._system_prompt = (
            "You are an assistant for helping students for questions regarding academic policies or bylaws. You have been provided information from official sources."
            "Use ONLY the following pieces of retrieved context to answer. the question. If the answer can be quoted from the PDFs then do that."
            "If the question is not related to academic policies/bylaws then simply reply \"Sorry I cannot answer that question as of now\". If the question is relevant to academic policies/bylaws and you do not know the answer" 
            "then say that you do not know. Feel free to engage in casual human conversation. Be kind. Please Keep the answer moderately concise."
            "\n\n"
            "{context}"
        )

        self._prompt = ChatPromptTemplate.from_messages(
                    [
                        ("system", self._system_prompt),
                        MessagesPlaceholder("chat_history"),
                        ("human", "{input}"),
                    ]
                )
        
        self._question_answer_chain = create_stuff_documents_chain(self._model, self._prompt)
        self._rag_chain = create_retrieval_chain(self._history_aware_retriever, self._question_answer_chain)
    
    def _determine_question_type(
            self,
            chat_history: list,
            input: str,
            ):
        self._questiontype_prompt = ChatPromptTemplate(
                [("system",''' 
                    You are given a task to classify if a question is a casual one or not. 

                    Respond with "No" if the statement or question directly or indirectly (as a follow-up question) strictly pertains to knowing anything about the academic policies, bylaws or academic information.
                    Respond with "Yes" if the statement or question is about any other topic or signifies thanking you or greeting or salutation or an attempt to engage in normal conversation. 

                    Output should be strictly Yes or No.
                '''), 
                MessagesPlaceholder('chat_history'),
                MessagesPlaceholder('input')]
        )

        response = self._model.invoke(self._questiontype_prompt.invoke({
            "chat_history": chat_history,
            "input": [input]
        }))

        print("Response: ", response)

        return response

def main(thread_id: str, question: str) -> dict:
    """
        Main function
    """
    model_name = "llama-3.1-70b-versatile"
    embedding_model_name = "sentence-transformers/all-MiniLM-L6-v2"
    temperature = 0.1

    print("initializing model..")

    model_obj = ChatModelQnA()
    model_obj._initialize_api("GROQ_API_KEY", "HF_TOKEN")
    model_obj._initialize_model(model_name=model_name, temperature=temperature, embedding_model_name=embedding_model_name)

    print('Connecting to EC2 Postgres DB and Chat Memory..')

    connection="postgresql+psycopg://langchain:langchain321@3.230.205.205:5432/langchain"
    chatConnectionString="postgres://langchain:langchain321@3.230.205.205:5432/langchain"
    collection_name = "initial_docs"

    vector_store = PGVector(
        embeddings=model_obj._embeddings,
        collection_name=collection_name,
        connection=connection,
        use_jsonb=True,
    )

    print('Connected to EC2 Postgres DB..')
    # vector_store.similarity_search_with_relevance_scores("what is student audit?")

    print('Initializing Retriever chain..')
    model_obj._initialize_retriever_chain(vector_store=vector_store)

    print('Sending query..')
    config = {"configurable": {"thread_id": thread_id}}
    result = model_obj._ask_query(
        input_text=question,
        config=config,
        chatMemoryConnectingString=chatConnectionString
    )

    print('Response received..')
    response = dict()
    response['answer'] = result['answer']
    response['user_id'] = thread_id

    casual_or_not = model_obj._determine_question_type(result['chat_history'], result['input']).content

    # Dictionary to store pdf names as keys and lists of page numbers as values
    pdf_pages = {}
    pdf_links = {}

    print("Length of chat history: ", len(result['chat_history']))
    # print("Context first 5 docs: ", result['context'][:5])
    # print("Casual decision: ", casual_or_not)
    # Iterate over each document
    for doc in result['context']:
        pdf_name = doc.metadata['pdf_name']
        page_number = doc.metadata['page_number']
        pdf_link = doc.metadata['pdf_link']
        
        # Add page numbers to the list for each pdf_name
        if pdf_name not in pdf_pages:
            pdf_pages[pdf_name] = []
            pdf_links[pdf_name] = pdf_link
        pdf_pages[pdf_name].append(page_number)
    
    print("Casual decision: ", casual_or_not)
    if casual_or_not.strip()=="Yes":
        response['source_pdf_pages'] =  []
        response['source_pdf_links'] =  []
        print(response['answer'])
        return response
    
    print("Not a casual question")
    response['source_pdf_pages'] =  pdf_pages
    response['source_pdf_links'] =  pdf_links
    # print("Response: \n", response)
    # print(response['answer'])
    # print(response['source_pdf_pages'])
    # print(response['source_pdf_links'])
    return response

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the ChatModelQnA with a thread ID and question.")
    parser.add_argument("thread_id", type=str, help="The thread ID for the query session")
    parser.add_argument("question", type=str, help="The question to ask the model")

    args = parser.parse_args()
    main(args.thread_id, args.question)