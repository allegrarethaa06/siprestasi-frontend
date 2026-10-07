import { Check, GraduationCap } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Data Akun',
    subtitle: 'Identitas & Kata Sandi',
  },
  {
    number: 2,
    title: 'Verifikasi KRS',
    subtitle: 'Validasi Status Akademik',
  },
  {
    number: 3,
    title: 'Verifikasi Email',
    subtitle: 'Kode OTP Student',
  },
]

function AuthSidebar({ activeStep = 1 }) {
  return (
    <aside className="auth-sidebar">
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

      <div className="sidebar-content">
        <h1>
          Mulai Pendaftaran Anda
        </h1>

        <p>
          Buat akun SIPRESTASI untuk mengikuti proses seleksi
          Mahasiswa Berprestasi.
        </p>

        <div className="registration-steps">
          {steps.map((step) => {
            const isActive = step.number === activeStep
            const isCompleted = step.number < activeStep

            return (
              <div
                key={step.number}
                className={`registration-step ${
                  isActive ? 'active' : ''
                } ${
                  isCompleted ? 'completed' : ''
                }`}
              >
                <div className="step-number">
                  {isCompleted ? (
                    <Check size={20} strokeWidth={2.5} />
                  ) : (
                    step.number
                  )}
                </div>

                <div className="step-content">
                  <div className="step-title-row">
                    <div className="step-title">
                      {step.title}
                    </div>

                    {isCompleted && (
                      <span className="step-completed-badge">
                        Selesai
                      </span>
                    )}
                  </div>

                  <div className="step-subtitle">
                    {step.subtitle}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default AuthSidebar