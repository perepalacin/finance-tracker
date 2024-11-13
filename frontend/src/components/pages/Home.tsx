import { Outlet } from 'react-router-dom';
import AddButton from '../AddButton';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../nav/AppSidebar';
import PageHeader from './PageHeader';

const Home = () => {

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
