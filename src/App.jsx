import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import AdminDashboard from './pages/Admin_dashboard'
import DaftarMapres from './pages/DaftarMapres'
import VerifikasiPengajuan from './pages/VerifikasiPengajuan' 
import LihatDetail from './pages/LihatDetail'
import TinjauRevisi from './pages/TinjauRevisi'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/daftar-mapres"
          element={<DaftarMapres />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />
        <Route
           path="/admin/daftar-mapres/:nim/verifikasi"
           element={<VerifikasiPengajuan />}
        />

        <Route
          path="/admin/daftar-mapres/:nim/detail"
          element={<LihatDetail />}
        />

        <Route
          path="/admin/daftar-mapres/:nim/revisi"
          element={<TinjauRevisi />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App