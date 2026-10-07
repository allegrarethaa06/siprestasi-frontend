import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react'

import LoginSidebar from '../../components/auth/LoginSidebar'
import PasswordStrength from '../../components/auth/PasswordStrength'

import '../../styles/auth/auth-layout.css'
import '../../styles/auth/login.css'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email =
        'Email student wajib diisi.'
    } else if (
      !/^[^\s@]+@student\.pradita\.ac\.id$/i.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        'Gunakan email @student.pradita.ac.id.'
    }

    if (!formData.password) {
      newErrors.password =
        'Password wajib diisi.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    /*
      MOCK LOGIN
      Nanti diganti API backend.
    */

    console.log('Login data:', formData)

    navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <LoginSidebar />

        <section className="auth-main">
          <div className="login-container">

            <div className="form-heading">
              <h2>
                Masuk ke SIPRESTASI
              </h2>

              <p>
                Masukkan akun Anda untuk melanjutkan.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="login-form">

                {/* EMAIL */}

                <div className="form-group">
                  <label htmlFor="email">
                    Email Student <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan Email Student"
                    className={
                      errors.email
                        ? 'input-error'
                        : ''
                    }
                  />

                  {errors.email && (
                    <p className="field-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}

                <div className="form-group password-group">
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>

                  <div
                    className={`password-input ${
                      errors.password
                        ? 'input-error'
                        : ''
                    }`}
                  >
                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan Password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>

                  {/* PASSWORD STRENGTH */}

                  <PasswordStrength
                    password={formData.password}
                  />

                  {errors.password && (
                    <p className="field-error">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* REMEMBER + FORGOT */}

                <div className="login-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={
                        formData.rememberMe
                      }
                      onChange={handleChange}
                    />

                    <span>
                      Ingat saya
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="forgot-password-link"
                  >
                    Lupa Password?
                  </Link>
                </div>

                {/* LOGIN */}

                <button
                  type="submit"
                  className="primary-button login-button"
                >
                  Masuk
                  <ArrowRight size={20} />
                </button>

                {/* REGISTER */}

                <div className="auth-bottom-link login-register-link">
                  Belum punya akun?{' '}

                  <Link to="/register">
                    Daftar
                  </Link>
                </div>

              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login