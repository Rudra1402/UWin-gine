"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserContext } from '@/context/context';
import { handleLogout } from '@/apis/userApis';
import { useRouter } from 'next/navigation';
import { FaRegUserCircle } from 'react-icons/fa';

function Navbar() {
  const router = useRouter();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserContext();
  const [authChecked, setAuthChecked] = useState(false); // Flag to check auth status
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown state

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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-800">
            UWingine
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3 text-[16.5px]">
            <Link
              href="/chat"
              className="p-1 rounded text-blue-600 hover:text-blue-800 transition duration-200 flex items-center justify-center"
            >Chat</Link>
            <Link
              href="/quickdates"
              className="p-1 rounded text-blue-600 hover:text-blue-800 transition duration-200 flex items-center justify-center"
            >Dates</Link>
            <p className="text-gray-300 text-xl">|</p>
            {authChecked && isLoggedIn ? (
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
            )}
          </div>
          {/* Mobile Menu */}
          <div className="md:hidden relative">
            {authChecked && isLoggedIn ? (
              <div
                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full cursor-pointer"
                onClick={toggleDropdown}
              >
                {user?.first_name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <button
                type="button"
                className="text-gray-600 flex items-center focus:outline-none focus:text-blue-800"
                onClick={toggleDropdown}
              >
                <FaRegUserCircle size={28} className='text-blue-800' />
              </button>
            )}
            {/* Dropdown Menu */}
            {dropdownOpen && !isLoggedIn && (
              <div className="absolute top-12 right-0 bg-white border shadow-md rounded-md w-40">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {/* Dropdown Menu */}
            {dropdownOpen && isLoggedIn && (
              <div className="absolute top-12 right-0 bg-white border shadow-md rounded-md w-40">
                <Link
                  href="/chat"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Chat
                </Link>
                <Link
                  href="/quickdates"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dates
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
