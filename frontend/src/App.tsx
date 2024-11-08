import { createBrowserRouter, Navigate, Route, RouterProvider, Routes } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext';
import SignUpForm from './components/auth/SignUpForm';
import TopBar from './components/nav/TopBar';
import Home from './components/pages/Home';
import ErrorPage from './components/pages/error-page';
import BankAccountsPage from './components/pages/BankAccountsPage';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/bank-accounts",
          element: <BankAccountsPage />
        }
      ]
    },
    {
      path: "/auth/sign-in",
      element: <SignUpForm />
    },
    {
      path: "/auth/sign-up",
      element: <SignUpForm />
    }
  ]);

  // const {authUser} = useAuthContext();

  return (
    <div>
        <RouterProvider router={router} />
    </div>
  )
}

export default App
