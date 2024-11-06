import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { Landmark } from 'lucide-react'

const TopBar = () => {
  return (
    <div className='absolute top-0 w-full flex flex-row h-14 justify-between items-center px-2 z-50 bg-background'>
        <div className='flex flex-row gap-2 items-center'>
            <Landmark size={28}/>
            <p>Finance tracker</p>
        </div>
        <ThemeToggler />
    </div>
  )
}

export default TopBar
