// import ChatLayout from '@/components/layouts/ChatLayout'
// import React from 'react'
// import { IoSend } from 'react-icons/io5';

// function page() {
//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 <div className='max-w-[75%] text-gray-700 px-4 py-3 bg-gray-100 rounded-lg shadow self-end'>
//                     <p>Hi! I need some information about senate policies.</p>
//                 </div>
//                 <div className='max-w-[75%] text-gray-700 px-4 py-3 bg-blue-100 rounded-lg shadow self-start'>
//                     <p className='m-0'>The Senate is responsible for oversight of academic matters. This includes, but is not limited to: academic policy, admission requirements, program regulations, program development, and student discipline system. Senate also has bylaws and policies that guide its activities.</p>
//                 </div>
//             </div>
//             <div
//                 className='flex items-center gap-2 h-12 w-full'
//             >
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                 />
//                 <button className='border rounded-md p-[14px] bg-gray-100 border-gray-300'>
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     )
// }

// export default page;


// Add the 'use client' directive at the top

//2

// "use client";

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
// };

// function Page() {
//     // State to store messages with type definition
//     const [messages, setMessages] = useState<Message[]>([
//         {
//             text: "Hi! I need some information about senate policies.",
//             isUser: true
//         }
//     ]);
//     // State to store the current message input with type definition
//     const [currentMessage, setCurrentMessage] = useState<string>('');

//     // Function to handle sending messages
//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '') return;

//         // Add user message to messages array
//         const newMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages([...messages, newMessage]);

//         // Call your API endpoint
//         try {
//             const response = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message: currentMessage })
//             });
//             const data = await response.json();

//             // Add API response to messages array
//             setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//         }

//         setCurrentMessage('');  // Clear the input after sending
//     };

//     // Function to handle input change
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
//         setCurrentMessage(event.target.value);
//     };

//     // Function to handle key press
//     const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
//         if (event.key === 'Enter') {
//             sendMessage();
//         }
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`max-w-[75%] text-gray-700 px-4 py-3 ${message.isUser ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'} rounded-lg shadow`}>
//                         <p>{message.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={handleInputChange}
//                     onKeyPress={handleKeyPress}
//                 />
//                 <button className='border rounded-md p-[14px] bg-gray-100 border-gray-300' onClick={sendMessage}>
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;



// Add the 'use client' directive at the top

//3
// "use client";

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
// };

// function Page() {
//     // State to store messages with type definition
//     const [messages, setMessages] = useState<Message[]>([]);
//     // State to store the current message input with type definition
//     const [currentMessage, setCurrentMessage] = useState<string>('');

//     // Function to handle sending messages
//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '') return;

//         // Add user message to messages array
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);

//         // Prepare to send the current message to the API
//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message: currentMessage })
//             });
//             const data = await response.json();

//             // Add API response to messages array
//             const apiResponse: Message = {
//                 text: data.answer,
//                 isUser: false
//             };
//             setMessages(prevMessages => [...prevMessages, apiResponse]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             // Optionally handle error by displaying a message in the chat
//             setMessages(prevMessages => [...prevMessages, { text: 'Error retrieving response from server.', isUser: false }]);
//         }

//         setCurrentMessage('');  // Clear the input after sending
//     };

//     // Function to handle input change
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
//         setCurrentMessage(event.target.value);
//     };

//     // Function to handle key press (send message on Enter key)
//     const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
//         if (event.key === 'Enter' && !event.shiftKey) {
//             event.preventDefault();  // Prevent the default action to avoid a newline in input
//             sendMessage();
//         }
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`max-w-[75%] text-gray-700 px-4 py-3 ${message.isUser ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'} rounded-lg shadow`}>
//                         <p>{message.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={handleInputChange}
//                     onKeyPress={handleKeyPress}
//                 />
//                 <button className='border rounded-md p-[14px] bg-gray-100 border-gray-300' onClick={sendMessage}>
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;


// // Import necessary modules from React and Next.js
// "use client"; // Use the 'use client' directive for Next.js 13 and above

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
// };

// // Define a type for the API request body
// type ApiRequestBody = {
//     thread_id: string;
//     question: string;
// };

// function Page() {
//     // State to store messages
//     const [messages, setMessages] = useState<Message[]>([]);
//     // State to store the current message input
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     // Example thread ID, replace with dynamic data as needed
//     const threadId = "67269acd7e5030e4908da7e0";

//     // Function to handle sending messages
//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '') return; // Do not send empty messages

//         // Create user message and add it to the messages array
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);

//         // Prepare the API request body
//         const requestBody: ApiRequestBody = {
//             thread_id: threadId,
//             question: currentMessage
//         };

//         // Call your API endpoint
//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody)
//             });
//             const data = await response.json();

//             // Handle the API response and add it to the messages array
//             const apiResponse: Message = {
//                 text: data.message,
//                 isUser: false
//             };
//             setMessages(prevMessages => [...prevMessages, apiResponse]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             // Display an error message in the chat interface
//             setMessages(prevMessages => [...prevMessages, { text: 'Error retrieving response from server.', isUser: false }]);
//         }

//         // Clear the input field after sending the message
//         setCurrentMessage('');
//     };

//     // Function to handle changes in the input field
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
//         setCurrentMessage(event.target.value);
//     };

//     // Function to send the message when the Enter key is pressed
//     const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
//         if (event.key === 'Enter' && !event.shiftKey) {
//             event.preventDefault();  // Avoid newline in input
//             sendMessage();
//         }
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`max-w-[75%] text-gray-700 px-4 py-3 ${message.isUser ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'} rounded-lg shadow`}>
//                         <p>{message.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={handleInputChange}
//                     onKeyPress={handleKeyPress}
//                 />
//                 <button className='border rounded-md p-[14px] bg-gray-100 border-gray-300' onClick={sendMessage}>
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;


// "use client"; // Use the 'use client' directive for Next.js 13 and above

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
// };

// // Define a type for the API request body
// type ApiRequestBody = {
//     thread_id: string;
//     question: string;
// };

// function Page() {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [isSending, setIsSending] = useState<boolean>(false); // State to manage sending status
//     const threadId = "67269acd7e5030e4908da7e0"; // Example thread ID

//     // Function to handle sending messages
//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '' || isSending) return; // Prevent empty or duplicate messages

//         setIsSending(true); // Prevent new requests until the current one is processed
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);
//         setCurrentMessage(''); // Clear the input immediately after send

//         const requestBody: ApiRequestBody = {
//             thread_id: threadId,
//             question: currentMessage
//         };

//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody)
//             });
//             const data = await response.json();

//             const apiResponse: Message = {
//                 text: data.message, // Adjust according to your API response structure
//                 isUser: false
//             };
//             setMessages(prevMessages => [...prevMessages, apiResponse]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             setMessages(prevMessages => [...prevMessages, { text: 'Error retrieving response from server.', isUser: false }]);
//         }

//         setIsSending(false); // Allow new requests
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`max-w-[75%] text-gray-700 px-4 py-3 ${message.isUser ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'} rounded-lg shadow`}>
//                         <p>{message.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyPress={(event) => {
//                         if (event.key === 'Enter' && !event.shiftKey) {
//                             event.preventDefault(); // Avoid newline
//                             sendMessage();
//                         }
//                     }}
//                     disabled={isSending} // Disable input when sending
//                 />
//                 <button
//                     className='border rounded-md p-[14px] bg-gray-100 border-gray-300'
//                     onClick={sendMessage}
//                     disabled={isSending} // Disable button when sending
//                 >
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;


// "use client"; // Use the 'use client' directive for Next.js 13 and above

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
// };

// // Define a type for the API request body
// type ApiRequestBody = {
//     thread_id: string;
//     question: string;
// };

// function Page() {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [isSending, setIsSending] = useState<boolean>(false); // State to manage sending status
//     const threadId = "67269acd7e5030e4908da7e0"; // Example thread ID

//     // Function to handle sending messages
//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '' || isSending) return; // Prevent empty or duplicate messages

//         setIsSending(true); // Prevent new requests until the current one is processed
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);

//         setCurrentMessage(''); // Clear the input field immediately after send

//         const requestBody: ApiRequestBody = {
//             thread_id: threadId,
//             question: currentMessage
//         };

//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody)
//             });
//             const data = await response.json();

//             const apiResponse: Message = {
//                 text: data.message, // Adjust according to your API response structure
//                 isUser: false
//             };
//             setMessages(prevMessages => [...prevMessages, apiResponse]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             setMessages(prevMessages => [...prevMessages, { text: 'Error retrieving response from server.', isUser: false }]);
//         }

//         setIsSending(false); // Allow new requests
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
//                 {messages.map((message, index) => (
//                     <div key={index} className={`max-w-[75%] text-gray-700 px-4 py-3 ${message.isUser ? 'bg-gray-100 self-end' : 'bg-blue-100 self-start'} rounded-lg shadow`}>
//                         <p>{message.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyPress={(event) => {
//                         if (event.key === 'Enter' && !event.shiftKey) {
//                             event.preventDefault(); // Avoid newline
//                             sendMessage();
//                         }
//                     }}
//                 />
//                 <button
//                     className='border rounded-md p-[14px] bg-gray-100 border-gray-300'
//                     onClick={sendMessage}
//                     disabled={isSending} // Disable button when sending
//                 >
//                     <IoSend className='text-blue-600 text-xl' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;

// // // Import necessary modules from React and Next.js
// "use client"; // Use the 'use client' directive for Next.js 13 and above

// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState, useEffect, useRef } from 'react';
// import { IoSend } from 'react-icons/io5';

// // Define a type for the message object
// type Message = {
//     text: string;
//     isUser: boolean;
//     loading?: boolean; // Optional loading state for animation
// };

// // Define a type for the API request body
// type ApiRequestBody = {
//     thread_id: string;
//     question: string;
// };

// function Page() {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [isSending, setIsSending] = useState<boolean>(false); // State to manage sending status
//     const threadId = "67269acd7e5030e4908da7e0"; // Example thread ID
//     const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the latest message

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '' || isSending) return;

//         setIsSending(true);
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);

//         setCurrentMessage('');

//         // Simulate a loading state for the response
//         const loadingMessage: Message = { text: '', isUser: false, loading: true };
//         setMessages(prevMessages => [...prevMessages, loadingMessage]);

//         const requestBody: ApiRequestBody = {
//             thread_id: threadId,
//             question: currentMessage
//         };

//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody)
//             });
//             const data = await response.json();

//             // Replace loading message with actual response
//             setMessages(prevMessages => [
//                 ...prevMessages.slice(0, -1),
//                 {
//                     text: data.message,
//                     isUser: false
//                 }
//             ]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             setMessages(prevMessages => [
//                 ...prevMessages.slice(0, -1),
//                 { text: 'Error retrieving response from server.', isUser: false }
//             ]);
//         }

//         setIsSending(false);
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)] overflow-auto p-4'>
//                 {messages.map((message, index) =>
//                     message.loading ? (
//                         <div key={index} className="flex justify-start items-center">
//                             <div className="space-x-2 flex">
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div key={index} className={`max-w-[75%] px-4 py-3 ${message.isUser ? 'bg-gray-100 ml-auto' : 'bg-blue-100'} rounded-lg shadow`}>
//                             <p>{message.text}</p>
//                         </div>
//                     )
//                 )}
//                 <div ref={messagesEndRef} />
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full p-4'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='flex-1 rounded-md p-3 border border-gray-300 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyPress={(event) => {
//                         if (event.key === 'Enter' && !event.shiftKey) {
//                             event.preventDefault(); // Avoid newline
//                             sendMessage();
//                         }
//                     }}
//                 />
//                 <button
//                     className='border rounded-md p-3 bg-gray-100 border-gray-300'
//                     onClick={sendMessage}
//                     disabled={isSending}
//                 >
//                     <IoSend className='text-xl text-blue-600' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;
// "use client"; 
// // Import react-markdown at the top of the file
// import ReactMarkdown from 'react-markdown';
// import ChatLayout from '@/components/layouts/ChatLayout';
// import React, { useState, useEffect, useRef } from 'react';
// import { IoSend } from 'react-icons/io5';

// type Message = {
//     text: string;
//     isUser: boolean;
//     loading?: boolean;
// };

// type ApiRequestBody = {
//     thread_id: string;
//     question: string;
// };

// function Page() {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [currentMessage, setCurrentMessage] = useState<string>('');
//     const [isSending, setIsSending] = useState<boolean>(false);
//     const threadId = "67269acd7e5030e4908da7e0";
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const sendMessage = async (): Promise<void> => {
//         if (currentMessage.trim() === '' || isSending) return;

//         setIsSending(true);
//         const userMessage: Message = {
//             text: currentMessage,
//             isUser: true
//         };

//         const cleanText = (text: any) => {
//             return text
//                 .replace(/^Query\s*/, '')                // Remove "Query" at the start
//                 .replace(/\s*has been processed for user!?$/, ''); // Remove "has been processed for user" at the end
//         };
//         setMessages(prevMessages => [...prevMessages, userMessage]);

//         setCurrentMessage('');

//         const loadingMessage: Message = { text: '', isUser: false, loading: true };
//         setMessages(prevMessages => [...prevMessages, loadingMessage]);

//         const requestBody: ApiRequestBody = {
//             thread_id: threadId,
//             question: currentMessage
//         };

//         try {
//             const response = await fetch('http://localhost:8000/user/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody)
//             });
//             const data = await response.json();

//             setMessages(prevMessages => [
//                 ...prevMessages.slice(0, -1),
//                 {
//                     text: data.message,
//                     isUser: false
//                 }
//             ]);
//         } catch (error) {
//             console.error('Failed to send message:', error);
//             setMessages(prevMessages => [
//                 ...prevMessages.slice(0, -1),
//                 { text: 'Error retrieving response from server.', isUser: false }
//             ]);
//         }

//         setIsSending(false);
//     };

//     return (
//         <ChatLayout>
//             <div className='flex flex-col gap-4 h-[calc(100%-48px)] overflow-auto p-4'>
//                 {messages.map((message, index) =>
//                     message.loading ? (
//                         <div key={index} className="flex justify-start items-center">
//                             <div className="space-x-2 flex">
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-flashing"></div>
//                             </div>
//                         </div>
//                     ) : (
//                         <div key={index} className={`max-w-[75%] px-4 py-3 ${message.isUser ? 'bg-gray-100 ml-auto' : 'bg-blue-100'} rounded-lg shadow`}>
//                             {message.isUser ? (
//                                 <p>{message.text}</p>
//                             ) : (
//                                 <ReactMarkdown>{message.text}</ReactMarkdown>
//                             )}
//                         </div>
//                     )
//                 )}
//                 <div ref={messagesEndRef} />
//             </div>
//             <div className='flex items-center gap-2 h-12 w-full p-4'>
//                 <input
//                     id='chat-message'
//                     name='chat-message'
//                     type="text"
//                     className='flex-1 rounded-md p-3 border border-gray-300 bg-gray-100'
//                     placeholder='Write your message...'
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyPress={(event) => {
//                         if (event.key === 'Enter' && !event.shiftKey) {
//                             event.preventDefault();
//                             sendMessage();
//                         }
//                     }}
//                 />
//                 <button
//                     className='border rounded-md p-3 bg-gray-100 border-gray-300'
//                     onClick={sendMessage}
//                     disabled={isSending}
//                 >
//                     <IoSend className='text-xl text-blue-600' />
//                 </button>
//             </div>
//         </ChatLayout>
//     );
// }

// export default Page;
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
