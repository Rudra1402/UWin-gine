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
import { useUserContext } from '@/context/context';

const samplePrompts = ["What are the courses in Psychology for Master's degree?", "How are AAUs designated and its full form?", "What are the provisions for disabled students?"]

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
    chat_type: string;
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
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { isNewChat, setIsNewChat, setChatSessions, setCurrentSession, currentSession } = useUserContext();

    useEffect(() => {
        if (isNewChat) {
            setMessages([])
            return;
        }
    }, [isNewChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        document.title = "UG | Chat"
    }, [])

    const fetchChatHistory = async (threadId: string) => {
        console.log("New Chat", isNewChat)
        if (isNewChat) {
            setMessages([])
            return;
        }
        const history = await fetchChatHistoryApi(threadId, setIsPageLoading);
        // console.log("History", history)
        const formattedHistory: Message[] = history.flatMap((record: ChatHistoryRecord) => [
            { text: record.prompt, isUser: true },
            { text: record.answer, isUser: false, references: record.references }
        ]);

        // console.log("Test", formattedHistory)

        setMessages(formattedHistory);
    };

    useEffect(() => {
        const uid = getUserId()
        setThreadId(uid)

        if (uid && currentSession) {
            fetchChatHistory(currentSession?.session_id);
        } else {
            setIsPageLoading(false);
        }
    }, [currentSession])

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
        setCurrentMessage('');

        setIsSending(true);
        const userMessage: Message = {
            text: messageText,
            isUser: true
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        const loadingMessage: Message = { text: '', isUser: false, loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        const requestBody: ApiRequestBody = {
            thread_id: threadId,
            question: messageText,
            chat_type: 'c'
        };

        try {
            const data = await sendMessageApi(requestBody, setIsNewChat, setChatSessions, setCurrentSession, currentSession);

            const cleanedMessage = cleanText(data.message);

            const references: Reference[] = Object.entries(data?.result?.source_pdf_links).map(([title, link]) => ({
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
            console.log("Error sending message:", error);
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { text: "Failed to retrieve response.", isUser: false }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ChatLayout type={'c'}>
            {isPageLoading ?
                <div className="flex items-center justify-center gap-4 text-gray-500 text-xl leading-none h-[calc(100%-60px)] overflow-auto pt-3 px-4">
                    Loading...
                </div>
                :
                <div className='flex flex-col gap-4 h-[calc(100%-60px)] overflow-auto pt-3 px-4'>
                    <div className='text-center text-sm text-red-500 font-semibold bg-red-50 p-2 rounded shadow-md'>
                        Note: Uwingine may not provide an accurate answer always. Please confirm using sources.
                    </div>
                    {messages.length === 0 ? (
                        <div className="text-center font-semibold text-3xl mb-6 text-blue-700 h-full w-full flex flex-col gap-4 items-center justify-center">
                            <div className='text-blue-600 font-semibold text-2xl leading-none mb-2'>Sample Prompts</div>
                            {samplePrompts.map((prompt, index) => (
                                <div
                                    key={index}
                                    className="text-gray-500 text-lg leading-none p-4 rounded w-[90%] shadow-md border"
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
                                <div key={index} className={`max-w-[75%] ${message.isUser ? 'ml-auto' : ''}`}>
                                    {message.isUser ? (
                                        <p className={`text-gray-700 px-4 py-3 rounded-lg shadow bg-blue-100`}>{message.text}</p>
                                    ) : (
                                        <div className='flex flex-col items-start justify-center gap-2'>
                                            {message.references && message.references.length > 0 && (
                                                <div className='flex flex-col items-start justify-center w-full gap-1'>
                                                    <div className='flex items-center gap-2 text-gray-600'>
                                                        <GrResources className="text-lg" />{" Top Sources"}
                                                    </div>
                                                    {/* Display only the first reference with sorted pages */}
                                                    <div className='flex gap-2 w-full'>
                                                        {message.references.slice(0, 2).map((reference, index) => (
                                                            <Link
                                                                key={index}
                                                                href={reference.link}
                                                                target='_blank'
                                                                className='flex flex-col p-2 min-w-[33%] max-w-[33%] bg-gray-100 border rounded-md shadow text-gray-700 hover:bg-blue-50'
                                                            >
                                                                <p className="font-semibold text-blue-600 text-ellipsis overflow-hidden line-clamp-1">
                                                                    {reference.title}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Pages: {reference.pages.sort((a, b) => a - b).join(", ")}
                                                                </p>
                                                            </Link>
                                                        ))}
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
            }
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
                        onClick={() => sendMessage(currentMessage)}
                        disabled={isSending}
                    >
                        <IoSend className='text-xl text-blue-600' />
                    </button>
                </div>
        </ChatLayout>
    );
}

export default Page;
