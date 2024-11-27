"use client"
import React from 'react';
import ChatLayout from '@/components/layouts/ChatLayout';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoSend } from 'react-icons/io5';
import { MdQuestionAnswer } from 'react-icons/md';
import { sendDateMessageApi, fetchDateChatHistoryApi } from '../../apis/chatApis';
import { getUserId } from '../../utils/getUser';

const samplePrompts = ["When is Family Day?", "List all the holidays", "When are the Summer 2025 exams?"]

type Message = {
    text: string;
    isUser: boolean;
    loading?: boolean;
};

type ApiRequestBody = {
    thread_id: string;
    question: string;
    chat_type: string;
};

type ChatHistoryRecord = {
    prompt: string;
    answer: string;
};

function replaceUrls(text: string) {
    const urlRegex = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, (url) => `[Link](${url})`);
}

function MessageComponent({ text }: { text: string }) {
    const contentWithLinks = replaceUrls(text);
    return (
        <div className="text-gray-700 px-4 py-3 rounded-lg shadow bg-gray-100">
            <ReactMarkdown>{contentWithLinks}</ReactMarkdown>
        </div>
    );
}

function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [threadId, setThreadId] = useState<string>('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const uid = getUserId();
        setThreadId(uid);

        if (uid) {
            fetchChatHistory(uid);
        } else {
            setIsPageLoading(false);
        }
    }, []);

    useEffect(() => {
        document.title = "UG | Dates"
    }, [])

    const fetchChatHistory = async (threadId: string) => {
        const history = await fetchDateChatHistoryApi(threadId, setIsPageLoading);
        const formattedHistory: Message[] = history.flatMap((record: ChatHistoryRecord) => [
            { text: record.prompt, isUser: true },
            { text: record.answer, isUser: false },
        ]);

        setMessages(formattedHistory);
    };

    const handlePromptSelection = (prompt: string) => {
        setCurrentMessage(prompt);
        // console.log("Curr Message", currentMessage)
        sendMessage(prompt);
    };    

    const animateResponse = (text: string) => {
        let index = 0;
        const intervalId = setInterval(() => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].text = text.slice(0, index);
                return updatedMessages;
            });
            index++;
            if (index > text.length) clearInterval(intervalId);
        }, 5);
    };

    const cleanText = (text: string) => {
        return text
            .replace(/^Query\s*'*/, '')
            .replace(/\s*has been processed for user!?$/, '')
            .replace(/^'|['\s]+$/g, '')
            .trim();
    };

    const sendMessage = async (messageText = currentMessage): Promise<void> => {
        if (messageText.trim() === '' || isSending) return;
        setCurrentMessage('')
        setIsSending(true);
        const userMessage: Message = {
            text: messageText,
            isUser: true,
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);
    
        // Temporary loading message
        const loadingMessage: Message = { text: '', isUser: false, loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);
    
        const requestBody: ApiRequestBody = {
            thread_id: threadId,
            question: messageText,
            chat_type: 'd'
        };
    
        try {
            const data = await sendDateMessageApi(requestBody);
            const cleanedMessage = cleanText(data.message);
            const newBotMessage: Message = {
                text: cleanedMessage,
                isUser: false,
            };
            setMessages(prevMessages => [...prevMessages.slice(0, -1), newBotMessage]);
            animateResponse(cleanedMessage);
        } catch (error) {
            console.log("Error sending message:", error);
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { text: "Failed to retrieve response.", isUser: false },
            ]);
        } finally {
            setIsSending(false);
        }
    };   

    return (
        <ChatLayout type={'d'}>
            {isPageLoading ?
                <div className="flex items-center justify-center gap-4 text-gray-500 text-xl leading-none h-[calc(100%-60px)] overflow-auto pt-3 px-4">
                    Loading...
                </div>
                :
                <div className="flex flex-col gap-4 h-[calc(100%-60px)] overflow-auto pt-3 px-4">
                    {messages.length === 0 ? (
                        <div className="text-center font-semibold text-3xl mb-6 text-blue-700 h-full w-full flex flex-col gap-3 items-center justify-center">
                            <div className='text-blue-600 font-semibold text-2xl leading-none mb-2'>Sample Prompts</div>
                            {samplePrompts.map((prompt, index) => (
                                <div
                                    key={index}
                                    className="text-gray-500 text-lg leading-none p-4 rounded w-[75%] md:w-[60%] shadow-md border"
                                    role="button"
                                    aria-label={`Prompt ${index + 1}: ${prompt}`}
                                    onClick={() => handlePromptSelection(prompt)}
                                >
                                    {prompt}
                                </div>
                            ))}
                        </div>
                    ) : (
                        messages.map((message, index) =>
                            message.loading ? (
                                <div key={index} className="flex justify-start items-center">
                                    <div className="space-x-2 flex">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    id='dates-chat'
                                    className={`max-w-[75%] ${message.isUser ? 'ml-auto' : ''}`}>
                                    {message.isUser ? (
                                        <p className="text-gray-700 px-4 py-3 rounded-lg shadow bg-blue-100">
                                            {message.text}
                                        </p>
                                    ) : (
                                        <div className="flex flex-col items-start justify-center gap-2">
                                            <div className="flex flex-col items-start justify-center gap-1 text-gray-600 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <MdQuestionAnswer className="text-lg" />{"Answer"}
                                                </div>
                                                <MessageComponent text={message.text} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        )
                    )}
                    <div ref={messagesEndRef} />
                </div>
            }
            <div className="flex items-center gap-2 h-12 w-full p-4 mb-2.5">
                <input
                    id="chat-message"
                    name="chat-message"
                    type="text"
                    className="flex-1 rounded-md p-3 border border-gray-300 bg-gray-100 text-gray-700"
                    placeholder="Ask follow up question..."
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={event => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <button
                    className="border rounded-md p-3 bg-gray-100 border-gray-300"
                    onClick={() => sendMessage(currentMessage)}
                    disabled={isSending}
                >
                    <IoSend className="text-xl text-blue-600" />
                </button>
            </div>
        </ChatLayout>
    );
}

export default Page;
