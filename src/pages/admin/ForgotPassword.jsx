import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  X,
} from 'lucide-react'
import { api } from '../../api'
import LoginSidebar from '../../components/auth/LoginSidebar'
import PasswordStrength from '../../components/auth/PasswordStrength'
import '../../styles/auth/auth-layout.css'
import '../../styles/auth/login.css'
import '../../styles/auth/register.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const otpInputRefs = useRef([])
  const otpBusy = useRef(false)

  // 'email' | 'reset' | 'done'
  const [step, setStep] = useState('email')

  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // OTP Modal state (persis seperti di Register.jsx)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300)
  const [resendTime, setResendTime] = useState(60)
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [resetToken, setResetToken] = useState('')

  // Reset password state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailPattern = /^[^\s@]+@(student\.)?pradita\.ac\.id$/i
  const emailIsValid = emailPattern.test(email.trim())
  const emailError = emailTouched && email.trim() !== '' && !emailIsValid
  const isEmailFormValid = email.trim() !== '' && emailIsValid

  const passwordValid =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword)

  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === newPassword
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword
  const isResetFormValid = passwordValid && passwordsMatch

  /* =========================
     TIMER OTP (5 MENIT)
  ========================= */
  useEffect(() => {
    if (!otpModalOpen || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpModalOpen, timeLeft])

  /* =========================
     TIMER RESEND
  ========================= */
  useEffect(() => {
    if (!otpModalOpen || resendTime <= 0) return
    const timer = setInterval(() => {
      setResendTime((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpModalOpen, resendTime])

  /* =========================
     ESC MODAL
  ========================= */
  useEffect(() => {
    if (!otpModalOpen) return
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !otpSuccess) {
        setOtpModalOpen(false)
        setOtp(Array(6).fill(''))
        setOtpError('')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [otpModalOpen, otpSuccess])

  const maskEmail = (value) => {
    if (!value || !value.includes('@')) return ''
    const [username, domain] = value.split('@')
    const visibleUsername =
      username.length <= 2 ? username.charAt(0) : username.slice(0, 2)
    return `${visibleUsername}*****@${domain}`
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

  /* =========================
     KIRIM OTP & BUKA MODAL CARD
  ========================= */
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault()
    setEmailTouched(true)
    if (!isEmailFormValid || otpBusy.current) return

    otpBusy.current = true
    const normalizedEmail = email.trim().toLowerCase()

    setErrorMessage('')
    setOtp(Array(6).fill(''))
    setOtpError('')
    setOtpSuccess(false)
    setTimeLeft(300)
    setResendTime(60)
    setOtpModalOpen(true)

    try {
      const response = await api('auth/forgot-password', {
        method: 'POST',
        body: { email: normalizedEmail },
      })
      if (response?.data?.expires_in) setTimeLeft(response.data.expires_in)
      if (response?.data?.resend_after) setResendTime(response.data.resend_after)
    } catch (error) {
      setOtpError(error.message)
      setErrorMessage(error.message)
    } finally {
      otpBusy.current = false
    }
  }

  const handleCloseOtp = () => {
    if (otpSuccess) return
    setOtpModalOpen(false)
    setOtp(['', '', '', '', '', ''])
    setOtpError('')
  }

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const nextOtp = [...otp]
    nextOtp[index] = digit
    setOtp(nextOtp)
    setOtpError('')
    setOtpSuccess(false)

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()
    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (!pastedValue) return

    const nextOtp = ['', '', '', '', '', '']
    pastedValue.split('').forEach((digit, index) => {
      nextOtp[index] = digit
    })
    setOtp(nextOtp)
    setOtpError('')
    const nextFocusIndex = Math.min(pastedValue.length, 5)
    otpInputRefs.current[nextFocusIndex]?.focus()
  }

  const handleVerifyOtp = async () => {
    if (otpBusy.current) return
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 6 || timeLeft <= 0) {
      setOtpError('Masukkan 6 digit kode OTP yang masih berlaku dari email Anda.')
      return
    }
    otpBusy.current = true
    const normalizedEmail = email.trim().toLowerCase()
    try {
      const response = await api('auth/forgot-password/verify', {
        method: 'POST',
        body: { email: normalizedEmail, otp: enteredOtp },
      })
      setResetToken(response.data?.reset_token || '')
      setOtpError('')
      setOtpSuccess(true)
      setTimeout(() => {
        setOtpModalOpen(false)
        setStep('reset')
      }, 650)
    } catch (error) {
      setOtpError(error.message)
    } finally {
      otpBusy.current = false
    }
  }

  const handleResendOtp = async () => {
    if (resendTime > 0 || otpBusy.current) return
    otpBusy.current = true
    try {
      const response = await api('auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim().toLowerCase() },
      })
      setOtp(Array(6).fill(''))
      setOtpError('')
      setTimeLeft(response.data?.expires_in || 300)
      setResendTime(response.data?.resend_after || 60)
      otpInputRefs.current[0]?.focus()
    } catch (error) {
      setOtpError(error.message)
    } finally {
      otpBusy.current = false
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!isResetFormValid || loading) return

    setLoading(true)
    setErrorMessage('')

    try {
      await api('auth/forgot-password/reset', {
        method: 'POST',
        body: {
          email: email.trim().toLowerCase(),
          reset_token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
      })
      setStep('done')
    } catch (err) {
      setErrorMessage(
        err.message || 'Gagal menyimpan password baru. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }

  const renderOtpInput = (digit, index) => (
    <input
      key={index}
      ref={(element) => {
        otpInputRefs.current[index] = element
      }}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={digit}
      onChange={(event) => handleOtpChange(index, event.target.value)}
      onKeyDown={(event) => handleOtpKeyDown(index, event)}
      className={
        otpError
          ? 'otp-modal-input otp-modal-input-error'
          : 'otp-modal-input'
      }
      aria-label={`Digit OTP ${index + 1}`}
    />
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <LoginSidebar />

        <main className="auth-main">
          <div className="login-container">
            {step === 'email' && (
              <>
                <div className="form-heading login-heading">
                  <h2>Lupa Password?</h2>
                  <p>
                    Masukkan email Anda untuk menerima kode
                    verifikasi reset password.
                  </p>
                </div>

                {errorMessage && (
                  <div className="forgot-alert forgot-alert-error" role="alert">
                    {errorMessage}
                  </div>
                )}

                <form
                  className="login-form"
                  onSubmit={handleSendOtp}
                  noValidate
                >
                  <div className="form-group">
                    <label htmlFor="forgot-email">
                      Email <span>*</span>
                    </label>

                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      placeholder="nama@student.pradita.ac.id"
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      className={emailError ? 'input-error' : ''}
                    />

                    {emailError && (
                      <p className="field-error">
                        Gunakan email resmi Pradita
                        (@student.pradita.ac.id atau @pradita.ac.id).
                      </p>
                    )}
                  </div>

                  <div className="forgot-info">
                    <span className="forgot-info-icon">i</span>
                    <p>
                      Kami akan mengirimkan 6 digit kode OTP ke
                      email Anda untuk mereset password.
                    </p>
                  </div>

                  <div className="forgot-actions">
                    <button
                      type="button"
                      className="forgot-back-button"
                      onClick={() => navigate('/login')}
                    >
                      Kembali
                    </button>

                    <button
                      type="submit"
                      className="primary-button forgot-submit-button"
                      disabled={!isEmailFormValid}
                    >
                      Kirim Kode
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="form-heading login-heading">
                  <h2>Buat Password Baru</h2>
                  <p>
                    Silakan buat password baru untuk akun{' '}
                    <strong>{email.trim().toLowerCase()}</strong>.
                  </p>
                </div>

                {errorMessage && (
                  <div className="forgot-alert forgot-alert-error" role="alert">
                    {errorMessage}
                  </div>
                )}

                <form
                  className="login-form"
                  onSubmit={handleResetPassword}
                  noValidate
                >
                  <div className="form-group password-group">
                    <label htmlFor="forgot-new-password">
                      Password Baru <span>*</span>
                    </label>

                    <div className="password-input">
                      <input
                        id="forgot-new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        placeholder="Masukkan Password Baru"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label={
                          showNewPassword
                            ? 'Sembunyikan password'
                            : 'Tampilkan password'
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    <PasswordStrength password={newPassword} />
                  </div>

                  <div className="form-group password-group">
                    <label htmlFor="forgot-confirm-password">
                      Konfirmasi Password Baru <span>*</span>
                    </label>

                    <div
                      className={`password-input ${
                        passwordsDoNotMatch ? 'input-error' : ''
                      }`}
                    >
                      <input
                        id="forgot-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        placeholder="Ulangi Password Baru"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Sembunyikan password'
                            : 'Tampilkan password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {passwordsMatch && (
                      <p className="password-match">
                        <CheckCircle2 size={16} />
                        Password cocok
                      </p>
                    )}

                    {passwordsDoNotMatch && (
                      <p className="password-mismatch">
                        Password belum cocok
                      </p>
                    )}
                  </div>

                  <div className="forgot-actions">
                    <button
                      type="button"
                      className="forgot-back-button"
                      onClick={() => navigate('/login')}
                      disabled={loading}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="primary-button forgot-submit-button"
                      disabled={!isResetFormValid || loading}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Password'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 'done' && (
              <div className="forgot-done-card">
                <div className="forgot-done-icon">
                  <CheckCircle2 size={32} />
                </div>
                <h2>Password Berhasil Diubah!</h2>
                <p>
                  Password akun Anda telah berhasil diperbarui.
                  Silakan masuk kembali menggunakan password baru Anda.
                </p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Masuk Sekarang
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================
          OTP MODAL CARD (100% SAMA DENGAN REGISTER)
      ========================= */}
      {otpModalOpen && (
        <div
          className="otp-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseOtp()
            }
          }}
        >
          <div
            className="otp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-otp-modal-title"
          >
            {!otpSuccess && (
              <button
                type="button"
                className="otp-modal-close"
                onClick={handleCloseOtp}
                aria-label="Tutup"
              >
                <X size={19} />
              </button>
            )}

            <div className="otp-modal-icon">
              {otpSuccess ? (
                <CheckCircle2 size={27} />
              ) : (
                <Mail size={25} />
              )}
            </div>

            <div className="otp-modal-heading">
              <h2 id="forgot-otp-modal-title">
                {otpSuccess ? 'Kode Terverifikasi' : 'Verifikasi Email'}
              </h2>

              <p>
                {otpSuccess
                  ? 'Kode OTP valid. Mengarahkan ke pembuatan password baru...'
                  : 'Masukkan kode OTP 6 digit yang kami kirim ke email Anda.'}
              </p>
            </div>

            {!otpSuccess && (
              <>
                <div className="otp-modal-email">
                  <span>Kode OTP dikirim ke</span>
                  <strong>{maskEmail(email.trim())}</strong>
                </div>

                <div className="otp-modal-section">
                  <label>KODE VERIFIKASI 6 DIGIT</label>

                  <div
                    className="otp-modal-input-group"
                    onPaste={handleOtpPaste}
                  >
                    {otp
                      .slice(0, 3)
                      .map((digit, index) => renderOtpInput(digit, index))}

                    <span className="otp-modal-divider">-</span>

                    {otp
                      .slice(3)
                      .map((digit, index) => renderOtpInput(digit, index + 3))}
                  </div>

                  <div className="otp-modal-timer-row">
                    <span>Kode berlaku selama 5 menit</span>
                    <strong className={timeLeft <= 60 ? 'is-warning' : ''}>
                      {formatTime(timeLeft)}
                    </strong>
                  </div>

                  {otpError && (
                    <p className="otp-modal-error">{otpError}</p>
                  )}

                  <button
                    type="button"
                    className="primary-button otp-modal-verify-button"
                    onClick={handleVerifyOtp}
                  >
                    Verifikasi
                    <ArrowRight size={20} />
                  </button>

                  <div className="otp-modal-resend">
                    Tidak menerima kode?{' '}
                    {resendTime > 0 ? (
                      <>
                        Kirim ulang dalam{' '}
                        <strong>
                          00:{String(resendTime).padStart(2, '0')}
                        </strong>
                      </>
                    ) : (
                      <button type="button" onClick={handleResendOtp}>
                        Kirim ulang kode
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {otpSuccess && (
              <div className="otp-modal-success">
                <CheckCircle2 size={17} />
                Verifikasi berhasil
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
