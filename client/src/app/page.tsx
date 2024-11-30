"use client"

import React from 'react'
import Link from 'next/link'
// import UWingine from "../assets/images/uwingine_design.png"
import Image from 'next/image'
import Navbar from '@/components/navbar/LoginNavbar'
// import dataflow from "../../public/dataflow.svg"

function HomePage() {

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-50 text-gray-900"
      style={{ scrollbarWidth: "none" }}
    >
      <Navbar
      />
      {/* Hero Section */}
      <header className="flex flex-col items-center py-12 px-6">
        <h1 className="text-center text-4xl sm:text-5xl font-bold font-mono text-blue-800">Welcome to UWingine</h1>
        <p className="mt-4 text-xl text-gray-700 text-center max-w-2xl">
          Streamline your access to university policies, academic calendars, and documentation with an LLM-powered chatbot that provides timely, accurate answers.
        </p>
        <div className='flex items-center justify-center gap-4'>
          <Link
            href={'/chat'}
            className="mt-6 px-3 sm:px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg"
          >
            General Chat
          </Link>
          <Link
            href={'/quickdates'}
            className="mt-6 px-3 sm:px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base sm:text-lg"
          >
            Important Dates
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="p-16 px-8 sm:px-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center w-full">Why Choose UWingine?</h2>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: "Efficiency", description: "Quickly access the information you need." },
            { title: "Accessibility", description: "Available 24/7 for all students and staff." },
            { title: "Accurate Responses", description: "Provides references to official documents." },
            { title: "Reduced Staff Workload", description: "Automates repetitive queries." },
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-blue-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-6 bg-blue-50 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center">How UWingine Works</h2>
        <div className="mt-8 max-w-3xl mx-auto text-center text-gray-700">
          <p>
            Ask a question, and UWingine retrieves information directly from indexed university documents.
            Get accurate, up-to-date answers based on real policies and guidelines.
          </p>
        </div>
        <div className="mt-8 flex justify-center px-4 rounded-lg shadow-lg w-full max-w-3xl bg-white">
          <Image
            src={"https://firebasestorage.googleapis.com/v0/b/live-urls.appspot.com/o/data%20flow.drawio.svg?alt=media&token=1be384be-f5d5-4509-8ed9-fb7723496c74"}
            alt="Flow Diagram of UWingine"
            width={768}
            height={350}
            className="w-full mx-auto"
          />
        </div>
      </section>

      {/* Demo Section */}
      {/* <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center">Try a Sample Query</h2>
        <div className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-gray-700 mb-4">Ask UWingine:</div>
          <input
            type="text"
            placeholder="E.g., 'What is the policy on academic misconduct?'"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <button className="mt-4 w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">
            Submit
          </button>
        </div>
      </section> */}

      {/* Footer Section */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>&copy; 2024 UWingine. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/contact" className="hover:underline">Contact Us</Link>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
