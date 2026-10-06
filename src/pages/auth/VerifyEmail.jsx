import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Mail,
} from 'lucide-react'

import AuthSidebar from '../../components/auth/AuthSidebar'

import '../../styles/auth/auth-layout.css'
import '../../styles/auth/verify-email.css'

const MOCK_OTP = '123456'

function VerifyEmail() {
  const navigate = useNavigate()

  const registrationData = JSON.parse(
    sessionStorage.getItem('registrationData') || '{}'
  )

  const email = registrationData.email || ''

  const inputRefs = useRef([])

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ])

  const [timeLeft, setTimeLeft] = useState(300)
  const [resendTime, setResendTime] = useState(30)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  /*
    TIMER OTP 5 MENIT
  */
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  /*
    TIMER KIRIM ULANG
  */
  useEffect(() => {
    if (resendTime <= 0) return

    const timer = setInterval(() => {
      setResendTime((previous) =>
        previous > 0 ? previous - 1 : 0
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [resendTime])

  /*
    MASK EMAIL
  */
  const maskEmail = (value) => {
    if (!value || !value.includes('@')) {
      return 'email@student.pradita.ac.id'
    }

    const [username, domain] = value.split('@')

    const visibleUsername =
      username.length <= 2
        ? username.charAt(0)
        : username.slice(0, 2)

    return `${visibleUsername}*****@${domain}`
  }

  /*
    FORMAT TIMER
  */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${String(minutes).padStart(
      2,
      '0'
    )}:${String(remainingSeconds).padStart(
      2,
      '0'
    )}`
  }

  /*
    INPUT OTP
  */
  const handleOtpChange = (index, value) => {
    const digit = value
      .replace(/\D/g, '')
      .slice(-1)

    const nextOtp = [...otp]

    nextOtp[index] = digit

    setOtp(nextOtp)
    setError('')
    setSuccess(false)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  /*
    KEYBOARD
  */
  const handleKeyDown = (index, event) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus()
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus()
    }

    if (
      event.key === 'ArrowRight' &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  /*
    PASTE OTP
  */
  const handlePaste = (event) => {
    event.preventDefault()

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pastedValue) return

    const nextOtp = [
      '',
      '',
      '',
      '',
      '',
      '',
    ]

    pastedValue
      .split('')
      .forEach((digit, index) => {
        nextOtp[index] = digit
      })

    setOtp(nextOtp)

    const nextFocusIndex = Math.min(
      pastedValue.length,
      5
    )

    inputRefs.current[nextFocusIndex]?.focus()
  }

  /*
    VERIFIKASI OTP
  */
  const handleVerify = () => {
    setError('')

    const enteredOtp = otp.join('')

    /*
      OTP EXPIRED
    */
    if (timeLeft <= 0) {
      setError(
        'Kode OTP telah kedaluwarsa. Kirim ulang kode OTP.'
      )

      return
    }

    /*
      BELUM 6 DIGIT
    */
    if (enteredOtp.length !== 6) {
      setError(
        'Masukkan kode OTP 6 digit.'
      )

      return
    }

    /*
      OTP SALAH
    */
    if (enteredOtp !== MOCK_OTP) {
      setError(
        'Kode OTP tidak sesuai. Periksa kembali kode Anda.'
      )

      return
    }

    /*
      OTP BENAR
    */
    setSuccess(true)

    /*
      Simulasi sedikit delay supaya
      status berhasil sempat terlihat
    */
    setTimeout(() => {
      navigate('/register/success')
    }, 700)
  }

  /*
    KIRIM ULANG OTP
  */
  const handleResend = () => {
    if (resendTime > 0) return

    setOtp([
      '',
      '',
      '',
      '',
      '',
      '',
    ])

    setError('')
    setSuccess(false)

    setTimeLeft(300)
    setResendTime(30)

    inputRefs.current[0]?.focus()

    console.log(
      'OTP baru dikirim:',
      MOCK_OTP
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <AuthSidebar activeStep={3} />

        <section className="auth-main">
          <div className="register-container">

            {/* JUDUL */}

            <div className="form-heading">
              <h2>
                Verifikasi Email
              </h2>

              <p>
                Masukkan kode OTP yang kami kirim
                ke email student Anda.
              </p>
            </div>

            {/* EMAIL */}

            <div className="otp-email-card">
              <div className="otp-email-icon">
                <Mail size={24} />
              </div>

              <div>
                <span>
                  Kode OTP dikirim ke
                </span>

                <strong>
                  {maskEmail(email)}
                </strong>

                <p>
                  Periksa kotak masuk atau folder
                  spam pada email Anda.
                </p>
              </div>
            </div>

            {/* OTP */}

            <div className="otp-section">
              <label>
                KODE VERIFIKASI 6 DIGIT
              </label>

              <div
                className="otp-input-group"
                onPaste={handlePaste}
              >
                {otp.map(
                  (digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] =
                          element
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        handleOtpChange(
                          index,
                          event.target.value
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          index,
                          event
                        )
                      }
                      className={
                        error
                          ? 'otp-input-error'
                          : ''
                      }
                      aria-label={`Digit OTP ${
                        index + 1
                      }`}
                    />
                  )
                )}
              </div>

              {/* TIMER */}

              <div className="otp-timer-row">
                <span>
                  Kode berlaku selama 5 menit
                </span>

                <strong
                  className={
                    timeLeft <= 60
                      ? 'otp-time-warning'
                      : ''
                  }
                >
                  {formatTime(timeLeft)}
                </strong>
              </div>

              {/* ERROR */}

              {error && (
                <p className="otp-error">
                  {error}
                </p>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="otp-success">
                  <CheckCircle2 size={17} />

                  Email berhasil diverifikasi.
                </div>
              )}

              {/* BUTTON */}

              <button
                type="button"
                className="primary-button otp-verify-button"
                onClick={handleVerify}
                disabled={success}
              >
                {success
                  ? 'Berhasil Diverifikasi'
                  : 'Verifikasi'}

                {!success && (
                  <ArrowRight size={20} />
                )}
              </button>

              {/* RESEND */}

              <div className="otp-resend">
                Tidak menerima kode?{' '}

                {resendTime > 0 ? (
                  <>
                    Kirim ulang dalam{' '}

                    <strong>
                      00:
                      {String(
                        resendTime
                      ).padStart(
                        2,
                        '0'
                      )}
                    </strong>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                  >
                    Kirim ulang kode
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default VerifyEmail