import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react'

import AuthSidebar from '../../components/auth/AuthSidebar'
import PasswordStrength from '../../components/auth/PasswordStrength'

import '../../styles/auth/auth-layout.css'
import '../../styles/auth/register.css'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      nim: '',
      phone: '',
      password: '',
      confirmPassword: '',
    })

  const [errors, setErrors] =
    useState({})

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  /* =========================
     VALIDASI LANGSUNG
  ========================= */

  const nameValid =
    formData.name.trim().length > 0

  const emailValid =
    /^[^\s@]+@student\.pradita\.ac\.id$/i.test(
      formData.email.trim()
    )

  const nimValid =
    /^\d{10}$/.test(
      formData.nim
    )

  const phoneValid =
    formData.phone.length > 0 &&
    formData.phone.length <= 16

  const passwordValid =
    formData.password.length >= 8 &&
    /[a-z]/.test(
      formData.password
    ) &&
    /[A-Z]/.test(
      formData.password
    ) &&
    /\d/.test(
      formData.password
    ) &&
    /[^A-Za-z0-9]/.test(
      formData.password
    )

  const confirmPasswordValid =
    formData.confirmPassword.length > 0 &&
    formData.confirmPassword ===
      formData.password

  const formValid =
    nameValid &&
    emailValid &&
    nimValid &&
    phoneValid &&
    passwordValid &&
    confirmPasswordValid

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    let nextValue = value

    /* NIM hanya angka,
       maksimal 10 digit */
    if (name === 'nim') {
      nextValue = value
        .replace(/\D/g, '')
        .slice(0, 10)
    }

    /* Nomor telepon hanya angka,
       maksimal 16 digit */
    if (name === 'phone') {
      nextValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
    }

    setFormData(
      (previous) => ({
        ...previous,
        [name]: nextValue,
      })
    )

    if (errors[name]) {
      setErrors(
        (previous) => ({
          ...previous,
          [name]: '',
        })
      )
    }
  }

  /* =========================
     VALIDASI FORM
  ========================= */

  const validateForm = () => {
    const newErrors = {}

    /* NAMA */

    if (!formData.name.trim()) {
      newErrors.name =
        'Nama lengkap wajib diisi.'
    }

    /* EMAIL */

    if (!formData.email.trim()) {
      newErrors.email =
        'Email student wajib diisi.'
    } else if (!emailValid) {
      newErrors.email =
        'Gunakan email @student.pradita.ac.id.'
    }

    /* NIM */

    if (!formData.nim) {
      newErrors.nim =
        'NIM wajib diisi.'
    } else if (!nimValid) {
      newErrors.nim =
        'NIM harus terdiri dari 10 digit angka.'
    }

    /* NOMOR TELEPON */

    if (!formData.phone) {
      newErrors.phone =
        'Nomor telepon wajib diisi.'
    }

    /* PASSWORD */

    if (!formData.password) {
      newErrors.password =
        'Password wajib diisi.'
    } else if (!passwordValid) {
      newErrors.password =
        'Password harus memiliki minimal 8 karakter, huruf kecil, huruf kapital, angka, dan simbol.'
    }

    /* KONFIRMASI PASSWORD */

    if (
      !formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        'Konfirmasi password wajib diisi.'
    } else if (
      !confirmPasswordValid
    ) {
      newErrors.confirmPassword =
        'Konfirmasi password belum cocok.'
    }

    setErrors(newErrors)

    return (
      Object.keys(
        newErrors
      ).length === 0
    )
  }

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (
    event
  ) => {
    event.preventDefault()

    if (!formValid) {
      return
    }

    if (!validateForm()) {
      return
    }

    /*
      Sementara simpan data
      registrasi di sessionStorage.

      Nanti bagian ini yang akan
      kita sambungkan ke backend.
    */

    sessionStorage.setItem(
      'registrationData',
      JSON.stringify(
        formData
      )
    )

    navigate(
      '/register/krs'
    )
  }

  /* =========================
     PASSWORD MATCH
  ========================= */

  const passwordsMatch =
    formData.confirmPassword
      .length > 0 &&
    formData.confirmPassword ===
      formData.password

  const passwordsDoNotMatch =
    formData.confirmPassword
      .length > 0 &&
    formData.confirmPassword !==
      formData.password

  return (
    <main className="auth-page">

      <div className="auth-card">

        {/* SIDEBAR */}

        <AuthSidebar
          activeStep={1}
        />

        {/* MAIN */}

        <section className="auth-main">

          <div className="register-container">

            {/* HEADING */}

            <div className="form-heading">

              <h2>
                Daftar Akun
              </h2>

              <p>
                Lengkapi data berikut untuk
                membuat akun SIPRESTASI.
              </p>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >

              <div className="form-grid">

                {/* NAMA LENGKAP */}

                <div className="form-group">

                  <label htmlFor="name">
                    Nama Lengkap
                    <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan Nama Lengkap"
                    className={
                      errors.name
                        ? 'input-error'
                        : ''
                    }
                  />

                  {errors.name ? (
                    <p className="field-error">
                      {errors.name}
                    </p>
                  ) : (
                    <p className="field-helper">
                      Gunakan nama sesuai
                      data akademik.
                    </p>
                  )}

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label htmlFor="email">
                    Email Student
                    <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan Email Student"
                    className={
                      errors.email
                        ? 'input-error'
                        : ''
                    }
                  />

                  {errors.email ? (
                    <p className="field-error">
                      {errors.email}
                    </p>
                  ) : (
                    <p className="field-helper">
                      Gunakan email
                      @student.pradita.ac.id
                    </p>
                  )}

                </div>

                {/* NIM */}

                <div className="form-group">

                  <label htmlFor="nim">
                    NIM
                    <span>*</span>
                  </label>

                  <input
                    id="nim"
                    name="nim"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={
                      formData.nim
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan NIM"
                    className={
                      errors.nim
                        ? 'input-error'
                        : ''
                    }
                  />

                  {errors.nim && (
                    <p className="field-error">
                      {errors.nim}
                    </p>
                  )}

                </div>

                {/* NOMOR TELEPON */}

                <div className="form-group">

                  <label htmlFor="phone">
                    Nomor Telepon
                    <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={16}
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Masukkan Nomor Aktif"
                    className={
                      errors.phone
                        ? 'input-error'
                        : ''
                    }
                  />

                  {errors.phone && (
                    <p className="field-error">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* PASSWORD */}

                <div className="form-group password-group">

                  <label htmlFor="password">
                    Password
                    <span>*</span>
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
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
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
                        <EyeOff
                          size={19}
                        />
                      ) : (
                        <Eye
                          size={19}
                        />
                      )}
                    </button>

                  </div>

                  <PasswordStrength
                    password={
                      formData.password
                    }
                  />

                  {errors.password && (
                    <p className="field-error">
                      {errors.password}
                    </p>
                  )}

                </div>

                {/* KONFIRMASI PASSWORD */}

                <div className="form-group password-group">

                  <label htmlFor="confirmPassword">
                    Konfirmasi Password
                    <span>*</span>
                  </label>

                  <div
                    className={`password-input ${
                      errors.confirmPassword
                        ? 'input-error'
                        : ''
                    }`}
                  >

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Masukkan Password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Sembunyikan password'
                          : 'Tampilkan password'
                      }
                    >

                      {showConfirmPassword ? (
                        <EyeOff
                          size={19}
                        />
                      ) : (
                        <Eye
                          size={19}
                        />
                      )}

                    </button>

                  </div>

                  {passwordsMatch && (
                    <p className="password-match">

                      <CheckCircle2
                        size={16}
                      />

                      Password cocok

                    </p>
                  )}

                  {passwordsDoNotMatch && (
                    <p className="password-mismatch">
                      Password belum cocok
                    </p>
                  )}

                  {errors.confirmPassword &&
                    !passwordsDoNotMatch && (
                      <p className="field-error">
                        {
                          errors.confirmPassword
                        }
                      </p>
                    )}

                </div>

              </div>

              {/* BUTTON */}

              <button
                className="primary-button"
                type="submit"
                disabled={!formValid}
              >
                Lanjutkan

                <ArrowRight
                  size={20}
                />
              </button>

              {/* LOGIN */}

              <div className="auth-bottom-link">

                Sudah punya akun?{' '}

                <Link to="/login">
                  Masuk
                </Link>

              </div>

            </form>

          </div>

        </section>

      </div>

    </main>
  )
}

export default Register