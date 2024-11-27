import os
import asyncio
from dotenv import load_dotenv
load_dotenv()

from langchain_postgres import PGVector
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
from langchain_core.messages import BaseMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict
from typing import Sequence
import warnings
warnings.filterwarnings("ignore")

class ChatModelEmbedding():
    
    def __init__(self) -> None:
        pass
    
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
        
    def _initialize_model(
            self, 
            model_name: str, 
            temperature: float,
            embedding_model_name: str):
        self._model_name = model_name
        self._temperature = temperature
        self._model = ChatGroq(model=self._model_name, groq_api_key=self._groq_api_key, temperature=self._temperature)
        self._embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name)
    
    def _initialize_semantic_chunker(
            self,
            breakpoint_threshold_type: str,

    ):
        self._semantic_chunker = SemanticChunker(self._embeddings, breakpoint_threshold_type=breakpoint_threshold_type)
        
        self._semantic_chunks = []
        for page in self._pages:
            for chunk in self._semantic_chunker.create_documents([page["content"]]):
                chunk.metadata["pdf_name"] = page["pdf_name"]
                self._semantic_chunks.append(chunk)

    async def _load_pdfs(
            self,
            paths: list
    ):
        """
        Load multiple PDFs and store their content in self._pages with metadata.

        Args:
            paths: List of PDF paths.
        """
        self._pages = []
        for path in paths:
            loader = PyPDFLoader(path)
            async for page in loader.alazy_load():
                # Append each page along with the PDF name as metadata
                self._pages.append({
                    "content": page.page_content,
                    "pdf_name": path  # Add the PDF filename as metadata
                })


async def main():
    """
        Main function
    """
    model_name = "gemma2-9b-it"
    embedding_model_name = "sentence-transformers/all-MiniLM-L6-v2"
    temperature = 0.1

    print("initializing model..")

    model_obj = ChatModelEmbedding()
    model_obj._initialize_api("GROQ_API_KEY", "HF_TOKEN")
    model_obj._initialize_model(model_name=model_name, temperature=temperature, embedding_model_name=embedding_model_name)

    # file_paths = ["auditing_courses_0.pdf","academic_accommodation_for_students_with_disabilities_amended_july_17_2017.pdf"]
    print("Extracting PDF names..")
    
    file_paths = os.listdir("docs")
    file_paths = ["docs/"+x for x in file_paths if x.endswith('.pdf')]
    # file_paths

    print("Loading PDFs...")
    await model_obj._load_pdfs(file_paths)

    print("Creating chunks...")
    model_obj._initialize_semantic_chunker(breakpoint_threshold_type="percentile")
    
    # connection = "postgresql+psycopg://langchain:langchain@postgres:5432/langchain"
    connection="postgresql+psycopg://langchain:langchain321@3.230.205.205:5432/langchain"
    collection_name = "my_docs"

    print(model_obj._semantic_chunks[:2])

    # vector_store = PGVector(
    #     embeddings=model_obj._embeddings,
    #     collection_name=collection_name,
    #     connection=connection,
    #     use_jsonb=True,
    # )
    # vector_store.add_documents(model_obj._semantic_chunks)
    # print("Vector store created: ", vector_store)

if __name__ == "__main__":
    asyncio.run(main())