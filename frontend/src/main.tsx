import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { UserDataProvider } from './context/UserDataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <UserDataProvider>
          <ThemeProvider>
            <App />
            <Toaster />
          </ThemeProvider>
        </UserDataProvider>
  </StrictMode>,
)
