import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate() 

  // =========================
  // VALIDASI
  // =========================

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const emailError =
    emailTouched &&
    email.trim() !== '' &&
    !emailIsValid

  const passwordError =
    passwordTouched &&
    password.trim() === ''

  const isFormValid =
    email.trim() !== '' &&
    emailIsValid &&
    password.trim() !== ''

  // =========================
  // SUBMIT
  // =========================

const handleSubmit = (e) => {
  e.preventDefault()

  setEmailTouched(true)
  setPasswordTouched(true)
  setLoginError('')

  if (!isFormValid) {
    return
  }

  navigate('/admin/dashboard')
}

  return (
    <main className="login-page">
      <section className="login-card">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="login-left">

          <div className="brand">

            <div className="brand-icon">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 10l10-5 10 5-10 5-10-5Z" />
                <path d="M6 12v5c3 2 9 2 12 0v-5" />
              </svg>
            </div>

            <div>
              <h2>SIPRESTASI</h2>
              <p>SISTEM PRESTASI MAHASISWA</p>
            </div>

          </div>

          <div className="welcome-content">
            <h1>Selamat Datang Kembali</h1>

            <p>
              Masuk sebagai Administrator untuk mengelola proses seleksi dan
              penilaian Mahasiswa Berprestasi.
            </p>
          </div>

          <div className="decoration decoration-top"></div>
          <div className="decoration decoration-bottom"></div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="login-right">

          <div className="login-form-wrapper">

            <div className="login-heading">
              <h1>Masuk ke SIPRESTASI</h1>

              <p>
                Masukkan akun Administrator Anda untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* =========================
                  EMAIL
              ========================= */}

              <div className="form-group">

                <label htmlFor="email">
                  Email<span>*</span>
                </label>

                <div className="input-wrapper">

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setLoginError('')
                    }}
                    onBlur={() => setEmailTouched(true)}
                    className={emailError ? 'input-error' : ''}
                  />

                  {emailError && (
                    <span
                      className="error-icon"
                      aria-hidden="true"
                    >
                      !
                    </span>
                  )}

                </div>

                {emailError && (
                  <p className="error-message" role="alert">
                    Format email tidak valid.
                  </p>
                )}

              </div>

              {/* =========================
                  PASSWORD
              ========================= */}

              <div className="form-group">

                <label htmlFor="password">
                  Password<span>*</span>
                </label>

                <div className="password-input">

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setLoginError('')
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    className={passwordError ? 'input-error' : ''}
                  />

                  {passwordError && (
                    <span
                      className="error-icon password-error-icon"
                      aria-hidden="true"
                    >
                      !
                    </span>
                  )}

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? 'Sembunyikan password'
                        : 'Tampilkan password'
                    }
                  >
                    {!showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.1 3.2" />
                        <path d="M6.6 6.6C3.8 8.3 2 12 2 12s3.5 8 10 8a9.8 9.8 0 0 0 4.4-1" />
                      </svg>
                    )}
                  </button>

                </div>

                {passwordError && (
                  <p className="error-message" role="alert">
                    Password wajib diisi.
                  </p>
                )}

              </div>

              {/* =========================
                  LOGIN ERROR
              ========================= */}

              {loginError && (
                <div className="login-error-alert" role="alert">
                  <span className="login-error-alert-icon">
                    !
                  </span>

                  <span>
                    {loginError}
                  </span>
                </div>
              )}

              {/* =========================
                  OPTIONS
              ========================= */}

              <div className="form-options">

                <label className="remember-me">

                  <input type="checkbox" />

                  <span className="custom-checkbox"></span>

                  Ingat saya

                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => navigate('/forgot-password')}
                >
                  Lupa Password?
                </button>

              </div>

              {/* =========================
                  LOGIN BUTTON
              ========================= */}

              <button
                type="submit"
                className="login-button"
                disabled={!isFormValid}
              >
                <span>Masuk</span>
                <span className="arrow">→</span>
              </button>

              {/* =========================
                  NOTE
              ========================= */}

              <div className="login-note">

                <div className="separator">
                  <span></span>
                  <i></i>
                  <span></span>
                </div>

                <p>
                  Hanya akun yang terdaftar sebagai Administrator
                  <br />
                  yang dapat mengakses sistem ini.
                </p>

              </div>

            </form>

          </div>
        </div>

      </section>
    </main>
  )
}

export default Login