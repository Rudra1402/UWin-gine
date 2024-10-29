import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import logo from "../../assets/images/landscape.png"

function Login() {
  return (
    <div className="h-screen w-screen overflow-auto flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-blue-50">
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
        <form className="w-full flex flex-col gap-5">
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
            placeholder="Enter your email"
          />
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
            placeholder="Enter your password"
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