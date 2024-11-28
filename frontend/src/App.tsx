import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignUpForm from './components/auth/SignUpForm';
import Home from './components/pages/Home';
import ErrorPage from './components/pages/error-page';
import BankAccountsPage from './components/pages/BankAccountsPage';
import TransfersPage from './components/pages/TransfersPage';
import InvestmentsPage from './components/pages/InvestmentsPage';
import IncomesPage from './components/pages/IncomesPage';
import ExpensesPage from './components/pages/ExpensesPage';
import Dashboard from './components/pages/Dashboard';

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
        },
        {
          path: "/investments",
          element: <InvestmentsPage />
        },
        {
          path: "/incomes",
          element: <IncomesPage />
        },
        {
          path: "/expenses",
          element: <ExpensesPage />
        },
        {
          path: "/",
          element: <Dashboard />
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

  return (
    <div>
        <RouterProvider router={router} />
    </div>
  )
}

export default App
