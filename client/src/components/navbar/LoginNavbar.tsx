"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserContext } from '@/context/context';
import { handleLogout } from '@/apis/userApis';
import { useRouter } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserContext();
  const [authChecked, setAuthChecked] = useState(false); // Flag to check auth status

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser["user_data"]) {
        setUser(parsedUser["user_data"]);
        setIsLoggedIn(true);
      }
    }
    setAuthChecked(true); // Set flag to true after checking
  }, [setUser, setIsLoggedIn]);

  const handleLogoutClick = () => {
    handleLogout(router, setUser, setIsLoggedIn);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            UWingine
          </Link>
          <div className="flex items-center gap-3 text-[16.5px]">
            <Link
              href="/chat"
              className="p-1 rounded text-blue-600 hover:text-blue-800 transition duration-200 flex items-center justify-center"
            >Chat</Link>
            <Link
              href="/quickdates"
              className="p-1 rounded text-blue-600 hover:text-blue-800 transition duration-200 flex items-center justify-center"
            >Dates</Link>
            <p className='text-gray-300 text-xl'>|</p>
            {authChecked ? (
              isLoggedIn ? (
                <>
                  <Link 
                  href="/profile" 
                  title={user?.first_name}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    {'Profile'}
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="p-1 text-red-600 rounded hover:text-red-800 transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="p-1 text-blue-600 rounded hover:text-blue-800 transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="p-1 text-blue-600 rounded hover:text-blue-800 transition duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )
            ) : null}
          </div>
          {/* <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 focus:outline-none focus:text-blue-800"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
