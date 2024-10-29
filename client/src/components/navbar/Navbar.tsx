import React from 'react'

function Navbar() {
  return (
    <div className='flex items-center justify-between gap-4 min-h-16 max-h-16 w-full px-6 border-b-2 border-b-gray-900'>
        <div className='font-mono tracking-wide text-lg'>Uwingine</div>
        <div className='h-9 w-9 rounded-full bg-white text-gray-700 flex items-center justify-center cursor-pointer font-mono text-xl'>RP</div>
    </div>
  )
}

export default Navbar