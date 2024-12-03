import React, { useState, useEffect } from 'react';
import { IoIosAddCircle, IoIosChatbubbles } from 'react-icons/io';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import classNames from 'classnames';
import { fetchSessionIdsByUser } from '@/apis/chatApis';
import { useUserContext } from '@/context/context';

function ChatList({ type = 'c' }) {
    const { isLoggedIn, isNewChat, setIsNewChat, currentSession, chatSessions, setCurrentSession, setChatSessions } = useUserContext();
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        setIsNewChat(false);
        const user = JSON.parse(localStorage.getItem('user'));
        fetchSessionIdsByUser(type, user?.user_data?.id, setChatSessions, setCurrentSession, setIsNewChat);
    }, [setChatSessions, setCurrentSession, setIsNewChat, type]);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    return (
        <div
            className={classNames(
                'bg-gray-50 flex flex-col gap-3 shadow-inner overflow-auto transition-all duration-300 relative',
                {
                    'w-[4rem] sm:w-[5rem]': isCollapsed,
                    'w-[100%] sm:w-1/5': !isCollapsed,
                },
                isCollapsed ? "p-2" : "p-3"
            )}
            style={{ scrollbarWidth: "none" }}
        >
            {/* Sidebar Toggle Button */}
            {/* <div
                className="absolute top-20 right-[-1.5rem] sm:right-[-2rem] p-1 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer z-9999"
                onClick={toggleSidebar}
            >
                {isCollapsed ? <IoIosArrowForward size={20} /> : <IoIosArrowBack size={20} />}
            </div> */}

            {/* Sidebar Header */}
            <div className={classNames("flex items-center gap-1 my-2", isCollapsed ? "justify-end" : "justify-between")}>
                {!isCollapsed && <h2 className="block text-xl leading-none font-semibold text-gray-700">Chats</h2>}
                {isLoggedIn && !isNewChat && !isCollapsed && (
                    <div className="w-full flex justify-end">
                        <IoIosAddCircle
                            className="text-3xl hover:text-blue-500 transition duration-150 leading-none text-blue-400"
                            onClick={() => {
                                setIsNewChat(true);
                                setCurrentSession(null);
                            }}
                        />
                    </div>
                )}
                <div
                    className=" flex items-center justify-end p-1 rounded-full bg-gray-400 hover:bg-gray-500 cursor-pointer z-1000 text-white"
                    onClick={toggleSidebar}
                >
                    {isCollapsed ? <IoIosArrowForward size={16} /> : <IoIosArrowBack size={16} />}
                </div>
            </div>

            {/* Chat Sessions */}
            {chatSessions.map((session, index) => (
                <div
                    key={index}
                    onClick={() => {
                        setIsCollapsed(true)
                        setCurrentSession(session);
                        setIsNewChat(false);
                    }}
                    className={classNames(
                        'flex items-center px-2 py-3 rounded-md transition-all cursor-pointer shadow',
                        currentSession?.session_id === session.session_id
                            ? 'bg-gray-700 !text-white hover:bg-gray-600'
                            : 'bg-white hover:bg-blue-100 text-gray-700',
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    {!isCollapsed && <IoIosChatbubbles className="text-gray-700 mr-2 text-lg" />}
                    {isCollapsed && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                    </div>}
                    {!isCollapsed && (
                        <div className="w-full text-sm font-medium text-ellipsis overflow-hidden line-clamp-1">
                            Chat_{index + 1}
                        </div>
                    )}
                </div>
            ))}

            {/* New Chat Option */}
            {isNewChat && (
                <div className="flex items-center px-2 py-3 rounded-md bg-white hover:bg-blue-100 transition-all cursor-pointer shadow">
                    {!isCollapsed && <IoIosChatbubbles className="text-gray-700 mr-2 text-lg" />}

                    <div className="w-full text-sm font-medium text-gray-700 text-ellipsis overflow-hidden line-clamp-1">
                        {isCollapsed ? "New" : "New Chat"}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatList;
