import { Outlet, useNavigate } from 'react-router-dom';
import AddButton from '../AddButton';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../nav/AppSidebar';
import PageHeader from './PageHeader';
import { useEffect } from 'react';

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const handleNoToken = () => {
      navigate('/auth/sign-in');
    };
    document.addEventListener('no-token', handleNoToken);
    return () => {
      document.removeEventListener('no-token', handleNoToken);
    };
  }, [navigate]);

  return (
    <div className='w-full h-screen relative'>
      <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className='w-full'>
        <AddButton />
        <div className='p-8'>
          <PageHeader />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
    </div>
  )
}

export default Home
