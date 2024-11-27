import React, { ReactNode } from 'react'
import Navbar from '../navbar/LoginNavbar';
import ChatList from '../chatlist/ChatList';

interface ChatLayoutProps {
    children: ReactNode;
    type: string;
}

function ChatLayout({ children, type }: ChatLayoutProps) {

    return (
        <div className='flex h-screen bg-gray-100'>
            <ChatList type={type} />
            <div className='flex-1 h-full flex flex-col bg-white shadow-lg overflow-hidden'>
                <Navbar
                />
                <div className='flex-1 p-0 overflow-y-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ChatLayout;
