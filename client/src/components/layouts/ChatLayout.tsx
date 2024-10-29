import React, { ReactNode } from 'react'
import Navbar from '../navbar/Navbar';
import ChatList from '../chatlist/ChatList';

interface ChatLayoutProps {
    children: ReactNode;
}

function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className='w-screen h-screen gap-0 flex'>
            <ChatList />
            <div className='w-4/5 flex flex-col gap-0'>
                <Navbar />
                {children}
            </div>
        </div>
    )
}

export default ChatLayout