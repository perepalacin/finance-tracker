import { useLocation } from 'react-router-dom'
import { navItems } from '../nav/AppSidebar';

const PageHeader = () => {
    const location = useLocation();
    const CURRENT_PATH = location.pathname.split("/")[1];
    const CURRENT_PAGE = navItems.find((route) => route.url === '/' + CURRENT_PATH); 
    
    if (CURRENT_PAGE) {
        return (
          <div className='flex flex-col gap-2 mb-6'>
            <span className='text-5xl'>{CURRENT_PAGE.emoji}</span>
            <h1 className='text-3xl font-semibold'>{CURRENT_PAGE.title}</h1>
          </div>
        )
    } 
    return null;
}

export default PageHeader
