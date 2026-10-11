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

import PraditaValue from './pages/PraditaValue'
import DetailPraditaValue from './pages/DetailPraditaValue'

import HasilSeleksi from './pages/HasilSeleksi'
import PeringkatTahap1 from './pages/PeringkatTahap1'

import Profile from './pages/Profile'

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

        <Route
          path="/admin/daftar-mapres"
          element={<DaftarMapres />}
        />

        <Route
          path="/admin/daftar-mapres/ranking"
          element={<PeringkatTahap1 />}
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

        <Route
          path="/admin/pradita-value"
          element={<PraditaValue />}
        />

        <Route
          path="/admin/pradita-value/:nim"
          element={<DetailPraditaValue />}
        />

        <Route
          path="/admin/hasil-seleksi"
          element={<HasilSeleksi />}
        />

        <Route
          path="/admin/profile"
          element={<Profile />}
        />
        
        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App