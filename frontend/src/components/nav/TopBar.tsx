import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { Landmark } from 'lucide-react'
import { Link } from 'react-router-dom'

const TopBar = () => {
  return (
    <nav className='absolute top-0 w-full flex flex-row h-14 justify-between items-center px-2 z-50 bg-background'>
        <Link to="/" className='flex flex-row gap-2 items-center'>
            <Landmark size={28}/>
            <p>Finance tracker</p>
        </Link>
        <ThemeToggler />
    </nav>
  )
}

export default TopBar
