import ChatLayout from '@/components/layouts/ChatLayout'
import React from 'react'
import { IoSend } from 'react-icons/io5';

function page() {
    return (
        <ChatLayout>
            <div className='flex flex-col gap-4 h-[calc(100%-48px)]'>
                <div className='max-w-[75%] text-gray-700 px-4 py-3 bg-gray-100 rounded-lg shadow self-end'>
                    <p>Hi! I need some information about senate policies.</p>
                </div>
                <div className='max-w-[75%] text-gray-700 px-4 py-3 bg-blue-100 rounded-lg shadow self-start'>
                    <p className='m-0'>The Senate is responsible for oversight of academic matters. This includes, but is not limited to: academic policy, admission requirements, program regulations, program development, and student discipline system. Senate also has bylaws and policies that guide its activities.</p>
                </div>
            </div>
            <div
                className='flex items-center gap-2 h-12 w-full'
            >
                <input
                    id='chat-message'
                    name='chat-message'
                    type="text"
                    className='rounded-md px-4 py-3 border border-gray-300 flex-1 text-gray-700 bg-gray-100'
                    placeholder='Write your message...'
                />
                <button className='border rounded-md p-[14px] bg-gray-100 border-gray-300'>
                    <IoSend className='text-blue-600 text-xl' />
                </button>
            </div>
        </ChatLayout>
    )
}

export default page;
