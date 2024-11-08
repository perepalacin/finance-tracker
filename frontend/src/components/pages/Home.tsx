import axios from 'axios';
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import TopBar from '../nav/TopBar';
import AddButton from '../AddButton';

const Home = () => {
    const fetchProtectedData = () => {
        const token = localStorage.getItem('token');

        axios.get('/api/v1/categories', {
            headers: {
                Authorization: token,
            },
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        fetchProtectedData();
    }, []);
  return (
    <div className='w-full h-screen relative'>
        <TopBar />
        <AddButton />
        <Outlet />
    </div>
  )
}

export default Home
