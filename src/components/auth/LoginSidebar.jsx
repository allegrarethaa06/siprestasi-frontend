import { GraduationCap } from 'lucide-react'

function LoginSidebar() {
  return (
    <aside className="auth-sidebar login-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={25} strokeWidth={2} />
        </div>

        <div>
          <div className="brand-name">
            SIPRESTASI
          </div>

          <div className="brand-subtitle">
            MAHASISWA BERPRESTASI
          </div>
        </div>
      </div>

      <div className="sidebar-content login-sidebar-content">
        <h1>
          Selamat Datang Kembali
        </h1>

        <p>
          Masuk untuk melanjutkan proses seleksi
          Mahasiswa Berprestasi Anda.
        </p>
      </div>
    </aside>
  )
}

export default LoginSidebar