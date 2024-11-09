import React from 'react'
import { IoIosAddCircle } from "react-icons/io";

function ChatList() {
    const chats = ['Chat'];

    return (
        <div className='w-1/5 bg-gray-50 p-4 flex flex-col gap-3 shadow-inner'>
            <div className='flex items-center justify-between mb-3'>
                <h2 className='text-xl leading-none font-semibold text-gray-700'>Chats</h2>
                <IoIosAddCircle className='text-3xl cursor-pointer hover:text-blue-500 transition duration-150 leading-none text-blue-400' />
            </div>
            {chats.map((chat, index) => (
                <div
                    key={index}
                    className='flex items-center px-4 py-3 rounded-md bg-white hover:bg-blue-100 transition-all cursor-pointer shadow'
                >
                    <div className='text-sm font-medium text-gray-700'>{chat}</div>
                </div>
            ))}
        </div>
    )
}

export default ChatList;
