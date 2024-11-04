import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthContext } from './context/AuthContext';
import SignUpForm from './components/auth/SignUpForm';

function App() {

  // const {authUser} = useAuthContext();

  return (
    <Routes>
      <Route path = "/auth" element={<SignUpForm />} />
      {/* <Route path= '/' element= {authUser ? <Home /> : <Navigate to={"/login"} />} />
      <Route path = '/login' element = {authUser ? <Navigate to = "/" /> : <Login />} />
      <Route path='/signup' element={authUser ? <Navigate to = "/"/> : <SignUp />} /> */}
    </Routes>
  )
}

export default App
