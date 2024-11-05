import Link from 'next/link';
import React from 'react'

function Navbar({ isLoggedIn}: { isLoggedIn: boolean }) {

  return (
    <div className='flex items-center justify-between px-6 py-4 border-b border-b-gray-300'>
      <div className='font-mono text-2xl font-semibold text-blue-700 tracking-wide'>Uwingine</div>
      {isLoggedIn ? (
        <>
          <div className='h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-mono text-lg'>
            {"RP"}
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center gap-3'>
          <Link
            href="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar;
