import {
  Route,
  Routes,
} from 'react-router-dom'

import LandingPage from './pages/student/LandingPage'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyKrs from './pages/auth/VerifyKrs'
import VerifyEmail from './pages/auth/VerifyEmail'
import RegisterSuccess from './pages/auth/RegisterSuccess'

import Dashboard from './pages/student/Dashboard'
import DashboardRanking from './pages/student/DashboardRanking'
import DashboardFinalis from './pages/student/DashboardFinalis'

import PendaftaranTahap1 from './pages/student/PendaftaranTahap1'
import ReviewTahap1 from './pages/student/ReviewTahap1'
import StatusVerifikasiTahap1 from './pages/student/StatusVerifikasiTahap1'

import PraditaValuePeers from './pages/student/PraditaValuePeers'
import PraditaValueStatus from './pages/student/PraditaValueStatus'

function App() {
  return (
    <Routes>

      {/* =========================
          LANDING PAGE
      ========================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />


      {/* =========================
          AUTH
      ========================== */}

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


      {/* =========================
          DASHBOARD MAHASISWA
      ========================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/dashboard/ranking"
        element={<DashboardRanking />}
      />

      <Route
        path="/dashboard/finalis"
        element={<DashboardFinalis />}
      />


      {/* =========================
          PENDAFTARAN TAHAP 1
      ========================== */}

      <Route
        path="/pendaftaran-mapres"
        element={<PendaftaranTahap1 />}
      />

      <Route
        path="/pendaftaran-mapres/review"
        element={<ReviewTahap1 />}
      />

      <Route
        path="/pendaftaran-mapres/status"
        element={<StatusVerifikasiTahap1 />}
      />


      {/* =========================
          PRADITA VALUE
      ========================== */}

      <Route
        path="/pradita-value/rekan-sejawat"
        element={<PraditaValuePeers />}
      />

      <Route
        path="/pradita-value/status"
        element={<PraditaValueStatus />}
      />

    </Routes>
  )
}

export default App