"use client";
import ChatLayout from '@/components/layouts/ChatLayout';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoSend } from 'react-icons/io5';
import { MdQuestionAnswer } from 'react-icons/md';
import { sendMessageApi, fetchChatHistoryApi } from '../../apis/chatApis';
import { getUserId } from '../../utils/getUser';
import { GrResources } from 'react-icons/gr';
import Link from 'next/link';

// Define a type for each reference in the chat record
type Reference = {
    title: string;
    link: string;
    pages: number[];
};

// Define a type for the message object
type Message = {
    text: string;
    isUser: boolean;
    loading?: boolean;
    references?: Reference[];
};

// Define a type for the API request body
type ApiRequestBody = {
    thread_id: string;
    question: string;
};

type ChatHistoryRecord = {
    prompt: string;
    answer: string;
    references: Reference[];
};

function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [threadId, setThreadId] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChatHistory = async (threadId: string) => {
        const history = await fetchChatHistoryApi(threadId);
        console.log("History", history)
        const formattedHistory: Message[] = history.flatMap((record: ChatHistoryRecord) => [
            { text: record.prompt, isUser: true },
            { text: record.answer, isUser: false, references: record.references }
        ]);

        console.log("Test",formattedHistory)

        setMessages(formattedHistory);
    };

    useEffect(() => {
        const uid = getUserId()
        setThreadId(uid)

        if (uid) {
            fetchChatHistory(uid);
        }
    }, [])

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

    const sendMessage = async (): Promise<void> => {
        if (currentMessage.trim() === '' || isSending) return;
    
        setIsSending(true);
        const userMessage: Message = {
            text: currentMessage,
            isUser: true
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setCurrentMessage('');
    
        // Temporary loading message
        const loadingMessage: Message = { text: '', isUser: false, loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);
    
        const requestBody: ApiRequestBody = {
            thread_id: threadId,
            question: currentMessage
        };
    
        try {
            const data = await sendMessageApi(requestBody);
    
            const cleanedMessage = cleanText(data.message);
    
            const references: Reference[] = Object.entries(data.result.source_pdf_links).map(([title, link]) => ({
                title,
                link: link as string,
                pages: data.result.source_pdf_pages[title]
            }));
    
            const newBotMessage: Message = {
                text: cleanedMessage,
                isUser: false,
                references: references
            };
    
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                newBotMessage
            ]);
            animateResponse(cleanedMessage)
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { text: "Failed to retrieve response.", isUser: false }
            ]);
        } finally {
            setIsSending(false);
        }
    };    

    return (
        <ChatLayout>
            <div className='flex flex-col gap-4 h-[calc(100%-60px)] overflow-auto pt-3 px-4'>
                {messages.length === 0 ? (
                    <div className="text-center font-semibold text-3xl mb-6 text-blue-700 h-full w-full flex items-center justify-center">
                        {"How can I help you today?"}
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
                            <div key={index} className={`max-w-[75%] ${message.isUser ? 'ml-auto' : ''}`}>
                                {message.isUser ? (
                                    <p className={`text-gray-700 px-4 py-3 rounded-lg shadow bg-blue-100`}>{message.text}</p>
                                ) : (
                                    <div className='flex flex-col items-start justify-center gap-2'>
                                        {message.references && message.references.length > 0 && (
                                            <div className='flex flex-col items-start justify-center w-full gap-1'>
                                                <div className='flex items-center gap-2 text-gray-600'>
                                                    <GrResources className="text-lg" />{"Sources"}
                                                </div>
                                                {/* Display only the first reference with sorted pages */}
                                                <div className='flex flex-col gap-2 w-full'>
                                                    <Link
                                                        href={message.references[0].link}
                                                        target='_blank'
                                                        className='flex flex-col p-2 min-w-[33%] max-w-[33%] bg-gray-100 border rounded-md shadow text-gray-700 hover:bg-blue-50'
                                                    >
                                                        <p className="font-semibold text-blue-600 text-ellipsis overflow-hidden line-clamp-1">{message.references[0].title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Pages: {message.references[0].pages.sort((a, b) => a - b).join(", ")}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        <div className='flex flex-col items-start justify-center gap-1 text-gray-600 mt-2'>
                                            <div className='flex items-center gap-2'>
                                                <MdQuestionAnswer className="text-lg" />{"Answer"}
                                            </div>
                                            <ReactMarkdown className='text-gray-700 px-4 py-3 rounded-lg shadow bg-gray-100'>{message.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className='flex items-center gap-2 h-12 w-full p-4 mb-2.5'>
                <input
                    id='chat-message'
                    name='chat-message'
                    type="text"
                    className='flex-1 rounded-md p-3 border border-gray-300 bg-gray-100 text-gray-700'
                    placeholder='Write your message...'
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <button
                    className='border rounded-md p-3 bg-gray-100 border-gray-300'
                    onClick={sendMessage}
                    disabled={isSending}
                >
                    <IoSend className='text-xl text-blue-600' />
                </button>
            </div>
        </ChatLayout>
    );
}

export default Page;
