import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Register from './pages/auth/Register'
import VerifyKrs from './pages/auth/VerifyKrs'
import VerifyEmail from './pages/auth/VerifyEmail'
import RegisterSuccess from './pages/auth/RegisterSuccess'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/register"
            replace
          />
        }
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
    </Routes>
  )
}

export default App