import axios from 'axios';
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import TopBar from '../nav/TopBar';
import AddButton from '../AddButton';

const Home = () => {

  return (
    <div className='w-full h-screen relative'>
        <TopBar />
        <AddButton />
        <Outlet />
    </div>
  )
}

export default Home
