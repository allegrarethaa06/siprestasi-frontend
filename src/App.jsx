import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './pages/Admin_dashboard'

function App() {
  return (
    <BrowserRouter>
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
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App