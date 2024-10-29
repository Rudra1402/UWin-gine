import React from 'react'

function ChatList() {
    const chats = ['Chat 1', 'Chat 2', 'Chat 3'];

    return (
        <div className='w-1/5 bg-gray-900 p-4 flex flex-col gap-2'>
            {chats.map((chat, index) => (
                <div 
                key={index}
                className='bg-black p-2.5 rounded'
                >{chat}</div>
            ))}
        </div>
    )
}

export default ChatList