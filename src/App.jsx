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


/* =========================
   ADMIN FEATURES
========================= */

import DaftarMapres from './pages/DaftarMapres'
import PeringkatTahap1 from './pages/PeringkatTahap1'
import VerifikasiPengajuan from './pages/VerifikasiPengajuan'
import LihatDetail from './pages/LihatDetail'
import TinjauRevisi from './pages/TinjauRevisi'

import PraditaValue from './pages/PraditaValue'
import DetailPraditaValue from './pages/DetailPraditaValue'

import HasilSeleksi from './pages/HasilSeleksi'


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

        {/* HOME */}

        <Route
          path="/"
          element={<HomeRedirect />}
        />


        {/* =========================
            AUTH
        ========================= */}

        <Route
          path="/superadmin/login"
          element={<SuperadminLogin />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedSuperadminRoute>
              <SuperadminDashboard />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            SELEKSI - DAFTAR MAPRES
        ========================= */}

        <Route
          path="/superadmin/daftar-mapres"
          element={
            <ProtectedSuperadminRoute>
              <DaftarMapres />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/daftar-mapres/ranking"
          element={
            <ProtectedSuperadminRoute>
              <PeringkatTahap1 />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/daftar-mapres/:nim/verifikasi"
          element={
            <ProtectedSuperadminRoute>
              <VerifikasiPengajuan />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/daftar-mapres/:nim/detail"
          element={
            <ProtectedSuperadminRoute>
              <LihatDetail />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/daftar-mapres/:nim/revisi"
          element={
            <ProtectedSuperadminRoute>
              <TinjauRevisi />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            SELEKSI - PRADITA VALUE
        ========================= */}

        <Route
          path="/superadmin/pradita-value"
          element={
            <ProtectedSuperadminRoute>
              <PraditaValue />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/pradita-value/:nim"
          element={
            <ProtectedSuperadminRoute>
              <DetailPraditaValue />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            SELEKSI - HASIL
        ========================= */}

        <Route
          path="/superadmin/hasil-seleksi"
          element={
            <ProtectedSuperadminRoute>
              <HasilSeleksi />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            KELOLA SISTEM
        ========================= */}

        <Route
          path="/superadmin/kelola-pengguna"
          element={
            <ProtectedSuperadminRoute>
              <KelolaPengguna />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/kelola-mahasiswa"
          element={
            <ProtectedSuperadminRoute>
              <KelolaMahasiswa />
            </ProtectedSuperadminRoute>
          }
        />


        <Route
          path="/superadmin/kelola-konten"
          element={
            <ProtectedSuperadminRoute>
              <KelolaKonten />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/superadmin/profile"
          element={
            <ProtectedSuperadminRoute>
              <SuperadminProfile />
            </ProtectedSuperadminRoute>
          }
        />


        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<HomeRedirect />}
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App