import Link from 'next/link'
import React from 'react'
import logo from "../../assets/images/landscape.png"
import Image from 'next/image';

function Signup() {
    return (
        <div className="h-screen w-screen overflow-auto flex flex-col items-center p-6 bg-gradient-to-br from-gray-100 to-blue-50">
            {/* <div className="text-5xl font-extrabold font-mono text-gray-800 mb-6">Uwin-gine</div> */}
            <div className='h-24 w-60 mb-6'>
                <Image
                    src={logo}
                    alt=""
                    className='h-16 w-60 rounded-md'
                />
            </div>
            <div className="flex flex-col gap-8 items-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-gray-700">Create an Account</h2>
                <form className="w-full flex flex-col gap-5">
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="First Name"
                    />
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Last Name"
                    />
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
                        placeholder="Password"
                    />
                    <select
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out text-gray-400"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select User Type
                        </option>
                        <option value="faculty-staff">Faculty/Staff</option>
                        <option value="current-undergrad">Current Undergrad Student</option>
                        <option value="current-grad">Current Grad Student</option>
                        <option value="incoming-undergrad">Incoming Undergrad Student</option>
                        <option value="incoming-grad">Incoming Grad Student</option>
                    </select>
                    <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-150 ease-in-out">
                        Sign Up
                    </button>
                </form>
                <div className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;