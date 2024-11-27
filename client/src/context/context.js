"use client"

import { createContext, useState, useContext, useLayoutEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false)
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useLayoutEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, chatSessions, currentSession, setCurrentSession, setChatSessions, isNewChat, setIsNewChat}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
