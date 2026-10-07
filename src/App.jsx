import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyKrs from './pages/auth/VerifyKrs'
import VerifyEmail from './pages/auth/VerifyEmail'
import RegisterSuccess from './pages/auth/RegisterSuccess'
import Dashboard from './pages/student/Dashboard'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/register/krs"
        element={<VerifyKrs />}
      />

      <Route
        path="/register/verify-email"
        element={<VerifyEmail />}
      />

      <Route
        path="/register/success"
        element={<RegisterSuccess />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
    </Routes>
  )
}

export default App