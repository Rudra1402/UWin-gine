import React, { ReactNode } from 'react'
import Navbar from '../navbar/Navbar';
import ChatList from '../chatlist/ChatList';

interface ChatLayoutProps {
    children: ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className='flex h-screen bg-gray-100'>
            <ChatList />
            <div className='flex-1 h-full flex flex-col bg-white shadow-lg overflow-hidden'>
                <Navbar />
                <div className='flex-1 p-0 overflow-y-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ChatLayout;
