"use client"

import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'
import {useRouter} from 'next/navigation'
import logo from "../../assets/images/landscape.png"
import { handleLogin } from '@/apis/userApis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '@/context/context';

function Login() {

  const router = useRouter()
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserContext();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen w-screen overflow-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-blue-50">
      <ToastContainer />
      {/* <div className="text-5xl font-extrabold font-mono text-gray-800 mb-6">Uwin-gine</div> */}
      <div className='h-16 w-60 mb-6'>
        <Image
          src={logo}
          alt=""
          className='h-full w-60 rounded-md'
        />
      </div>
      <div className="flex flex-col gap-8 items-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-700">Welcome back</h2>
        <form
          className="w-full flex flex-col gap-5 text-gray-700"
          onSubmit={e => handleLogin(e, loginData, setLoginData, router, setUser, setIsLoggedIn)}
        >
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
            placeholder="Enter your email"
            onChange={handleInputChange}
            name='email'
          />
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
            placeholder="Enter your password"
            onChange={handleInputChange}
            name='password'
          />
          <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-150 ease-in-out">
            Submit
          </button>
        </form>
        <div className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;