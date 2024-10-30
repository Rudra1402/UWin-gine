import React from 'react'

function Navbar() {
  return (
    <div className='flex items-center justify-between px-6 py-4 border-b border-b-gray-300'>
        <div className='font-mono text-2xl font-semibold text-blue-700 tracking-wide'>Uwingine</div>
        <div className='h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer font-mono text-lg'>
            RP
        </div>
    </div>
  )
}

export default Navbar;
