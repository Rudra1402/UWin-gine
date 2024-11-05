"use client"; 
import ChatLayout from '@/components/layouts/ChatLayout';
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoSend } from 'react-icons/io5';

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

    // Function to clean up response text by removing unnecessary parts
    const cleanText = (text: string) => {
        return text
            .replace(/^Query\s*'*/, '')                // Remove "Query" at the start
            .replace(/\s*has been processed for user!?$/, '') // Remove "has been processed for user" at the end
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

        // Simulate a loading state for the response
        const loadingMessage: Message = { text: '', isUser: false, loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        const requestBody: ApiRequestBody = {
            thread_id: threadId,
            question: currentMessage
        };

        try {
            const response = await fetch('http://localhost:8000/user/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();

            const cleanedMessage = cleanText(data.message);

            // Replace loading message with actual response
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                {
                    text: cleanedMessage,
                    isUser: false
                }
            ]);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { text: 'Error retrieving response from server.', isUser: false }
            ]);
        }

        setIsSending(false);
    };

    return (
        <ChatLayout>
            <div className='flex flex-col gap-4 h-[calc(100%-48px)] overflow-auto p-4'>
                {messages.map((message, index) =>
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
                                <p>{message.text}</p>
                            ) : (
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            )}
                        </div>
                    )
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className='flex items-center gap-2 h-12 w-full p-4'>
                <input
                    id='chat-message'
                    name='chat-message'
                    type="text"
                    className='flex-1 rounded-md p-3 border border-gray-300 bg-gray-100'
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
