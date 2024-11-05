"use client";
import ChatLayout from '@/components/layouts/ChatLayout';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoSend } from 'react-icons/io5';
import { sendMessageApi } from '../../apis/chatApis';

// Define a type for the message object
type Message = {
    text: string;
    isUser: boolean;
    loading?: boolean;
};

// Define a type for the API request body
type ApiRequestBody = {
        thread_id: string;
        question: string;
    };

function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const threadId = "67269acd7e5030e4908da7e0"; // Example thread ID
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const cleanText = (text: string) => {
        return text
            .replace(/^Query\s*'*/, '')                // Remove "Query" at the start
            .replace(/\s*has been processed for user!?$/, '') // Remove "has been processed for user" at the end
            .replace(/^'|['\s]+$/g, '')
            .trim();
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
        }, 10);
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

        const loadingMessage: Message = { text: '', isUser: false, loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        const requestBody: ApiRequestBody = {
            thread_id: threadId,
            question: currentMessage
        };

        const data = await sendMessageApi(requestBody);

        const cleanedMessage = cleanText(data.message);

        setMessages(prevMessages => [
            ...prevMessages.slice(0, -1),
            {
                text: cleanedMessage,
                isUser: false
            }
        ]);

        animateResponse(cleanedMessage);
        setIsSending(false);
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
                                    <div key={index} className={`max-w-[75%] px-4 py-3 ${message.isUser ? 'bg-gray-100 ml-auto' : 'bg-blue-100'} rounded-lg shadow`}>
                                        {message.isUser ? (
                                            <p className='text-gray-700'>{message.text}</p>
                                        ) : (
                                            <ReactMarkdown className={'text-gray-700'}>{message.text}</ReactMarkdown>
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
