import { fetchSessionIdsByUser } from '@/apis/chatApis';
import { useUserContext } from '@/context/context';
import React, { useEffect } from 'react'
import { IoIosAddCircle, IoIosChatbubbles } from "react-icons/io";
import classNames from 'classnames';

function ChatList({ type = 'c' }) {
    // const chats = ['Chat'];
    const { isLoggedIn, isNewChat, setIsNewChat, currentSession, chatSessions, setCurrentSession, setChatSessions } = useUserContext()

    useEffect(() => {
        setIsNewChat(false)
        let user = JSON.parse(localStorage.getItem('user'))
        console.log("User ID", user?.user_data?.id)
        fetchSessionIdsByUser(type, user?.user_data?.id, setChatSessions, setCurrentSession, setIsNewChat)
    }, [setChatSessions, setCurrentSession, setIsNewChat, type])

    return (
        <div className='w-1/5 bg-gray-50 p-4 flex flex-col gap-3 shadow-inner'>
            <div className='flex items-center justify-between mb-3'>
                <h2 className='text-xl leading-none font-semibold text-gray-700'>Chats</h2>
                {isLoggedIn && !isNewChat
                    ? <IoIosAddCircle
                        className='text-3xl cursor-pointer hover:text-blue-500 transition duration-150 leading-none text-blue-400'
                        onClick={() => {
                            setIsNewChat(true)
                            setCurrentSession(null)
                        }}
                    />
                    : null
                }
            </div>
            {/* {chats.map((chat, index) => (
                <div
                    key={index}
                    className='flex items-center px-4 py-3 rounded-md bg-white hover:bg-blue-100 transition-all cursor-pointer shadow'
                >
                    <div className='text-sm font-medium text-gray-700'>{chat}</div>
                </div>
            ))} */}
            {chatSessions.map((session, index) => (
                <div
                    key={index}
                    onClick={() => {
                        setCurrentSession(session)
                        setIsNewChat(false)
                    }}
                    className={classNames('flex items-center px-2 py-3 rounded-md transition-all cursor-pointer shadow', currentSession?.session_id == session.session_id ? 'bg-gray-700 !text-white hover:bg-gray-600' : 'bg-white hover:bg-blue-100 text-gray-700')}
                >
                    <IoIosChatbubbles className='mr-1.5 text-lg' />
                    <div className='w-full text-sm font-medium text-ellipsis overflow-hidden line-clamp-1'>Chat_{index+1}</div>
                </div>
            ))}
            {isNewChat
                ? <div
                    className='flex items-center px-2 py-3 rounded-md bg-white hover:bg-blue-100 transition-all cursor-pointer shadow'
                >
                    <IoIosChatbubbles className='text-gray-700 mr-1.5 text-lg' />
                    <div className='w-full text-sm font-medium text-gray-700 text-ellipsis overflow-hidden line-clamp-1'>New Chat</div>
                </div>
                : null
            }
        </div>
    )
}

export default ChatList;
