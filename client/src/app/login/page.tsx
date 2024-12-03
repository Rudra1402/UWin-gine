"use client";
// import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// import logo from "../../assets/images/landscape.png";
import { handleLogin } from '@/apis/userApis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '@/context/context';
import Navbar from '@/components/navbar/LoginNavbar';

interface LoginData {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useUserContext();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  // Check for the token in local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true); // Update your context state if the token exists
      router.push('/'); // Redirect to a protected route if logged in
    }
  }, [setIsLoggedIn, router]);

  useEffect(() => {
    document.title = "UG | Login"
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(e, loginData, setLoginData, router, setUser, setIsLoggedIn);
  };

  return (
    <div className='h-screen w-screen overflow-auto'>
      <Navbar />
      <div className="w-full h-[calc(100%-65px)] overflow-auto flex flex-col items-center justify-center p-6 bg-gray-100">
        <ToastContainer />
        {/* <div className='h-16 w-60 mb-6'>
          <Image src={logo} alt="Logo" className='h-full w-60 rounded-md' />
        </div> */}
        <div className="flex flex-col gap-8 items-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">Welcome back</h2>
          <form
            className="w-full flex flex-col gap-5 text-gray-700"
            onSubmit={onSubmit}
          >
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
              placeholder="Enter your email"
              onChange={handleInputChange}
              name='email'
              value={loginData.email}
            />
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
              placeholder="Enter your password"
              onChange={handleInputChange}
              name='password'
              value={loginData.password}
            />
            <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-150 ease-in-out">
              Submit
            </button>
          </form>
          <div className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;