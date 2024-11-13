import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUpForm from './components/auth/SignUpForm';
import Home from './components/pages/Home';
import ErrorPage from './components/pages/error-page';
import BankAccountsPage from './components/pages/BankAccountsPage';
import TransfersPage from './components/pages/TransfersPage';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/accounts",
          element: <BankAccountsPage />
        },
        {
          path: "/transfers",
          element: <TransfersPage />
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
