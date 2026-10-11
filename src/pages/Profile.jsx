import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import './Profile.css'


function Profile() {
  const navigate = useNavigate()

  return (
    <div className="profile-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar variant="light" />


      {/* =========================
          CONTENT
      ========================= */}

      <main className="profile-content">

        {/* BACK */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          <span>←</span>
          Kembali
        </button>


        {/* PAGE HEADING */}
        <div className="profile-page-heading">

          <h1>
            Profil Administrator
          </h1>

          <p>
            Lihat informasi akun administrator SIPRESTASI.
          </p>

        </div>


        {/* =========================
            PROFILE SUMMARY
        ========================= */}

        <section className="profile-summary-card">

          <div className="profile-summary-left">

            <div className="profile-main-avatar">
              AL
            </div>

            <div className="profile-summary-info">

              <h2>
                Allegra Aretha Putri
              </h2>

              <span className="profile-role-badge">
                Administrator SIPRESTASI
              </span>

            </div>

          </div>

        </section>


        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">

            <div>
              <h2>
                Informasi Akun
              </h2>

              <p>
                Informasi identitas akun yang digunakan pada sistem.
              </p>
            </div>

          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">
                <span className="profile-info-label">
                Nama Lengkap
                </span>

                <strong>
                Allegra Aretha Putri
                </strong>
            </div>


            <div className="profile-info-item">
                <span className="profile-info-label">
                Email
                </span>

                <strong>
                allegra.aretha@pradita.ac.id
                </strong>
            </div>


            <div className="profile-info-item">
                <span className="profile-info-label">
                Role
                </span>

                <strong>
                Administrator
                </strong>
            </div>


            <div className="profile-info-item">
                <span className="profile-info-label">
                Status Akun
                </span>

                <div className="profile-account-status">
                <span className="profile-status-dot" />
                Aktif
                </div>
            </div>

            </div>
        </section>


        {/* =========================
            SECURITY
        ========================= */}

        <section className="profile-section">

          <div className="profile-security-row">

            <div className="profile-security-copy">

              <div className="profile-security-icon">
                <LockIcon />
              </div>

              <div>
                <h3>
                  Keamanan Akun
                </h3>

                <p>
                  Kelola keamanan dan kata sandi akun administrator.
                </p>
              </div>

            </div>


            <button
              type="button"
              className="profile-password-button"
              onClick={() => navigate('/forgot-password')}
            >
              Ubah Password
            </button>

          </div>

        </section>

      </main>

    </div>
  )
}


/* =========================
   ICON
========================= */

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />

      <path d="M12 14v2" />
    </svg>
  )
}


export default Profile