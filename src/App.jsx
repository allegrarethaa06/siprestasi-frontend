import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import SuperadminLogin from './pages/SuperadminLogin'
import SuperadminDashboard from './pages/SuperadminDashboard'

import KelolaPengguna from './pages/KelolaPengguna'
import KelolaMahasiswa from './pages/KelolaMahasiswa'
import KelolaKonten from './pages/KelolaKonten'

import SuperadminProfile from './pages/SuperadminProfile'
import ForgotPassword from './pages/ForgotPassword'


function isSuperadminAuthenticated() {
  return (
    localStorage.getItem(
      'siprestasi_superadmin_auth'
    ) === 'true'
  )
}


function ProtectedSuperadminRoute({
  children,
}) {
  if (!isSuperadminAuthenticated()) {
    return (
      <Navigate
        to="/superadmin/login"
        replace
      />
    )
  }

  return children
}


function HomeRedirect() {
  return (
    <Navigate
      to={
        isSuperadminAuthenticated()
          ? '/superadmin/dashboard'
          : '/superadmin/login'
      }
      replace
    />
  )
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<HomeRedirect />}
        />


        {/* LOGIN */}

        <Route
          path="/superadmin/login"
          element={<SuperadminLogin />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* DASHBOARD */}

        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedSuperadminRoute>
              <SuperadminDashboard />
            </ProtectedSuperadminRoute>
          }
        />


        {/* KELOLA PENGGUNA */}

        <Route
          path="/superadmin/kelola-pengguna"
          element={
            <ProtectedSuperadminRoute>
              <KelolaPengguna />
            </ProtectedSuperadminRoute>
          }
        />


        {/* KELOLA MAHASISWA */}

        <Route
          path="/superadmin/kelola-mahasiswa"
          element={
            <ProtectedSuperadminRoute>
              <KelolaMahasiswa />
            </ProtectedSuperadminRoute>
          }
        />


        {/* KELOLA KONTEN */}

        <Route
          path="/superadmin/kelola-konten"
          element={
            <ProtectedSuperadminRoute>
              <KelolaKonten />
            </ProtectedSuperadminRoute>
          }
        />


        {/* PROFILE */}

        <Route
          path="/superadmin/profile"
          element={
            <ProtectedSuperadminRoute>
              <SuperadminProfile />
            </ProtectedSuperadminRoute>
          }
        />


        {/* FALLBACK */}

        <Route
          path="*"
          element={<HomeRedirect />}
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App