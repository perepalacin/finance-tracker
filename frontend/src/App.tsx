import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext';
import SignUpForm from './components/auth/SignUpForm';
import TopBar from './components/nav/TopBar';

function App() {

  // const {authUser} = useAuthContext();

  return (
    <div>
      {/* <TopBar /> */}
      <Routes>
        <Route path = "/auth/sign-in" element={<SignUpForm />} />
        <Route path = "/auth/sign-up" element={<SignUpForm />} />
        {/* <Route path= '/' element= {authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path = '/login' element = {authUser ? <Navigate to = "/" /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to = "/"/> : <SignUp />} /> */}
      </Routes>
    </div>
  )
}

export default App
