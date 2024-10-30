import React from 'react'

function ChatList() {
    const chats = ['Chat 1', 'Chat 2', 'Chat 3'];

    return (
        <div className='w-1/5 bg-gray-50 p-4 flex flex-col gap-3 shadow-inner'>
            <h2 className='text-lg font-semibold text-gray-700 mb-3'>Chats</h2>
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
