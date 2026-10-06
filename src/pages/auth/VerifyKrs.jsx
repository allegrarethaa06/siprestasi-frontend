import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  FileUp,
  LoaderCircle,
  RefreshCw,
  XCircle,
} from 'lucide-react'

import AuthSidebar from '../../components/auth/AuthSidebar'

import '../../styles/auth/auth-layout.css'
import '../../styles/auth/verify-krs.css'

function VerifyKrs() {
    const navigate = useNavigate()
  const inputRef = useRef(null)

  /*
    Data Step 1 kita simpan sementara di sessionStorage.
    Kalau belum ada, object-nya kosong.
  */
  const registrationData = JSON.parse(
    sessionStorage.getItem('registrationData') || '{}'
  )

  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('upload')
  const [verificationIssues, setVerificationIssues] = useState([])

  /*
    ============================================
    MOCK DATA HASIL PEMBACAAN KRS
    ============================================

    Ini BELUM berasal dari PDF asli.

    Nanti backend teman kamu akan mengembalikan data
    dengan bentuk kurang lebih seperti object ini.
  */

  const mockKrsData = {
    name: 'Allegra Aretha Putri',
    nim: '2410102004',
    programStudi: 'Sistem Informasi',
    angkatan: '2024',
    semester: '5',
    periodeAkademik: '2026/2027',
    hasPraditaIdentity: true,
    isActivePeriod: true,
  }

  const handleFile = (file) => {
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
    ]

    const maxSize = 2 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Format file harus PNG, JPG, JPEG, atau PDF.'
      )

      setSelectedFile(null)
      setStatus('upload')

      return
    }

    if (file.size > maxSize) {
      setError('Ukuran file maksimal 2 MB.')

      setSelectedFile(null)
      setStatus('upload')

      return
    }

    setError('')
    setVerificationIssues([])
    setSelectedFile(file)
    setStatus('upload')
  }

  const handleChange = (event) => {
    const file = event.target.files[0]

    handleFile(file)

    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()

    const file = event.dataTransfer.files[0]

    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const formatFileSize = (size) => {
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  const getFileType = (file) => {
    if (file.type === 'application/pdf') {
      return 'PDF'
    }

    if (file.type === 'image/png') {
      return 'PNG'
    }

    return 'JPG'
  }

  const normalizeText = (text = '') => {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  const handleContinue = () => {
    if (!selectedFile) return

    setVerificationIssues([])
    setStatus('checking')
  }

  /*
    ============================================
    SIMULASI VERIFIKASI KRS
    ============================================
  */

  useEffect(() => {
    if (status !== 'checking') return

    const timer = setTimeout(() => {
      const issues = []

      /*
        CEK NAMA
      */

      if (
        normalizeText(registrationData.name) !==
        normalizeText(mockKrsData.name)
      ) {
        issues.push({
          type: 'name',
          title: 'Nama tidak sesuai',
          message:
            'Nama pada KRS tidak sesuai dengan nama yang Anda daftarkan.',
          accountValue:
            registrationData.name || 'Tidak tersedia',
          krsValue: mockKrsData.name,
        })
      }

      /*
        CEK NIM
      */

      if (
        String(registrationData.nim || '') !==
        String(mockKrsData.nim)
      ) {
        issues.push({
          type: 'nim',
          title: 'NIM tidak sesuai',
          message:
            'NIM pada KRS tidak sesuai dengan NIM yang Anda daftarkan.',
          accountValue:
            registrationData.nim || 'Tidak tersedia',
          krsValue: mockKrsData.nim,
        })
      }

      /*
        CEK PROGRAM STUDI
      */

      if (
        normalizeText(mockKrsData.programStudi) !==
        'sistem informasi'
      ) {
        issues.push({
          type: 'program',
          title: 'Program Studi tidak sesuai',
          message:
            'KRS yang diunggah bukan dari Program Studi Sistem Informasi.',
        })
      }

      /*
        CEK IDENTITAS PRADITA
      */

      if (!mockKrsData.hasPraditaIdentity) {
        issues.push({
          type: 'identity',
          title: 'Identitas Pradita tidak ditemukan',
          message:
            'Logo atau identitas Pradita tidak terdeteksi pada KRS.',
        })
      }

      /*
        CEK PERIODE AKADEMIK
      */

      if (!mockKrsData.isActivePeriod) {
        issues.push({
          type: 'period',
          title: 'KRS bukan periode aktif',
          message:
            'KRS yang diunggah bukan KRS pada periode akademik aktif.',
        })
      }

      setVerificationIssues(issues)

      if (issues.length > 0) {
        setStatus('rejected')
      } else {
        setStatus('verified')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [status])

  const handleReplaceFile = () => {
    setSelectedFile(null)
    setVerificationIssues([])
    setError('')
    setStatus('upload')

    setTimeout(() => {
      inputRef.current?.click()
    }, 0)
  }

const handleSendOtp = () => {
  navigate('/register/verify-email')
}

  return (
    <main className="auth-page">
      <div className="auth-card">
        <AuthSidebar activeStep={2} />

        <section className="auth-main">
          <div className="register-container">

            {/* =========================
                STATE UPLOAD
            ========================== */}

            {status === 'upload' && (
              <>
                <div className="form-heading">
                  <h2>Verifikasi KRS</h2>

                  <p>
                    Unggah KRS terbaru untuk memverifikasi
                    data dan status mahasiswa Anda.
                  </p>
                </div>

                <div className="krs-upload-section">
                  <label className="krs-label">
                    KRS Terbaru <span>*</span>
                  </label>

                  {!selectedFile ? (
                    <div
                      className="krs-dropzone"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <div className="krs-upload-icon">
                        <FileUp size={25} />
                      </div>

                      <h3>
                        Tarik dan letakkan Kartu Rencana
                        Studi di sini
                      </h3>

                      <p>
                        Format file dapat berupa screenshot
                        maupun PDF
                      </p>

                      <button
                        type="button"
                        className="krs-select-button"
                        onClick={() =>
                          inputRef.current?.click()
                        }
                      >
                        + Pilih File
                      </button>

                      <span className="krs-file-info">
                        PNG, JPG, atau PDF • Maksimal 2 MB
                      </span>
                    </div>
                  ) : (
                    <div className="krs-dropzone krs-dropzone-selected">
                      <div className="krs-selected-icon">
                        <FileText size={27} />
                      </div>

                      <div className="krs-selected-content">
                        <h3>
                          {selectedFile.name}
                        </h3>

                        <p>
                          {getFileType(selectedFile)} •{' '}
                          {formatFileSize(
                            selectedFile.size
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="krs-change-button"
                        onClick={() =>
                          inputRef.current?.click()
                        }
                      >
                        <RefreshCw size={16} />
                        Ganti File
                      </button>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleChange}
                    hidden
                  />

                  <p className="krs-helper">
                    Pastikan KRS terlihat jelas,
                    mencantumkan nama lengkap dan NIM yang
                    sesuai, Program Studi Sistem Informasi,
                    serta logo Pradita.
                  </p>

                  {error && (
                    <p className="field-error">
                      {error}
                    </p>
                  )}

                  {selectedFile && (
                    <button
                      type="button"
                      className="primary-button krs-continue-button"
                      onClick={handleContinue}
                    >
                      Lanjutkan
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* =========================
                STATE CHECKING
            ========================== */}

            {status === 'checking' &&
              selectedFile && (
                <>
                  <div className="form-heading">
                    <h2>Verifikasi KRS</h2>

                    <p>
                      Sistem sedang memeriksa KRS yang Anda
                      unggah.
                    </p>
                  </div>

                  <div className="krs-checking-file-card">
                    <div className="krs-checking-file-left">
                      <div className="krs-checking-file-icon">
                        <FileText size={24} />
                      </div>

                      <div className="krs-checking-file-info">
                        <h3>
                          {selectedFile.name}
                        </h3>

                        <p>
                          {formatFileSize(
                            selectedFile.size
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="krs-checking-badge">
                      <LoaderCircle
                        size={15}
                        className="krs-spinner"
                      />

                      <span>
                        Memeriksa...
                      </span>
                    </div>
                  </div>

                  <div className="krs-checking-panel">
                    <div className="krs-checking-loader">
                      <LoaderCircle
                        size={32}
                        className="krs-spinner"
                      />
                    </div>

                    <h3>
                      Memeriksa data KRS
                    </h3>

                    <p>
                      Sistem sedang mencocokkan data pada
                      KRS dengan data akun Anda.
                    </p>

                    <span>
                      Proses ini mencakup pemeriksaan
                      identitas dan status mahasiswa.
                    </span>
                  </div>
                </>
              )}

            {/* =========================
                STATE VERIFIED
            ========================== */}

            {status === 'verified' &&
              selectedFile && (
                <>
                  <div className="form-heading">
                    <h2>Verifikasi KRS</h2>

                    <p>
                      KRS Anda berhasil diverifikasi.
                    </p>
                  </div>

                  <div className="krs-verified-file-card">
                    <div className="krs-verified-file-left">
                      <div className="krs-verified-file-icon">
                        <FileText size={24} />
                      </div>

                      <div className="krs-verified-file-info">
                        <h3>
                          {selectedFile.name}
                        </h3>

                        <p>
                          {formatFileSize(
                            selectedFile.size
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="krs-verified-badge">
                      <CheckCircle2 size={16} />
                      KRS Terverifikasi
                    </div>
                  </div>

                  <div className="krs-success-message">
                    <CheckCircle2 size={22} />

                    <div>
                      <h3>
                        KRS Terverifikasi
                      </h3>

                      <p>
                        Data pada KRS telah sesuai dengan
                        informasi akun Anda.
                      </p>
                    </div>
                  </div>

                  <div className="student-data-card">
                    <h3>
                      Data dari KRS
                    </h3>

                    <p className="student-data-description">
                      Data berikut diperoleh dari KRS yang
                      telah diverifikasi.
                    </p>

                    <div className="student-data-grid">
                      <div className="student-data-item">
                        <span>Nama Lengkap</span>

                        <strong>
                          {mockKrsData.name}
                        </strong>
                      </div>

                      <div className="student-data-item">
                        <span>NIM</span>

                        <strong>
                          {mockKrsData.nim}
                        </strong>
                      </div>

                      <div className="student-data-item">
                        <span>
                          Program Studi
                        </span>

                        <strong>
                          {mockKrsData.programStudi}
                        </strong>
                      </div>

                      <div className="student-data-item">
                        <span>Angkatan</span>

                        <strong>
                          {mockKrsData.angkatan}
                        </strong>
                      </div>

                      <div className="student-data-item">
                        <span>Semester</span>

                        <strong>
                          {mockKrsData.semester}
                        </strong>
                      </div>

                      <div className="student-data-item">
                        <span>
                          Periode Akademik
                        </span>

                        <strong>
                          {mockKrsData.periodeAkademik}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="primary-button krs-send-otp-button"
                    onClick={handleSendOtp}
                  >
                    Kirim OTP
                    <ArrowRight size={20} />
                  </button>

                  <p className="krs-otp-helper">
                    OTP akan dikirim ke email student yang
                    Anda daftarkan.
                  </p>
                </>
              )}

            {/* =========================
                STATE REJECTED
            ========================== */}

            {status === 'rejected' &&
              selectedFile && (
                <>
                  <div className="form-heading">
                    <h2>Verifikasi KRS</h2>

                    <p>
                      KRS belum dapat diverifikasi.
                      Periksa informasi di bawah ini.
                    </p>
                  </div>

                  <div className="krs-rejected-file-card">
                    <div className="krs-rejected-file-left">
                      <div className="krs-rejected-file-icon">
                        <FileText size={24} />
                      </div>

                      <div className="krs-rejected-file-info">
                        <h3>
                          {selectedFile.name}
                        </h3>

                        <p>
                          {formatFileSize(
                            selectedFile.size
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="krs-rejected-badge">
                      <XCircle size={16} />

                      Belum Terverifikasi
                    </div>
                  </div>

                  <div className="krs-rejected-message">
                    <CircleAlert size={22} />

                    <div>
                      <h3>
                        KRS Belum Terverifikasi
                      </h3>

                      <p>
                        Terdapat data pada KRS yang tidak
                        sesuai dengan informasi akun Anda.
                      </p>
                    </div>
                  </div>

                  <div className="krs-issues-card">
                    <h3>
                      Data yang perlu diperiksa
                    </h3>

                    {verificationIssues.map(
                      (issue, index) => (
                        <div
                          className="krs-issue-item"
                          key={`${issue.type}-${index}`}
                        >
                          <XCircle size={18} />

                          <div className="krs-issue-content">
                            <strong>
                              {issue.title}
                            </strong>

                            <p>
                              {issue.message}
                            </p>

                            {issue.accountValue &&
                              issue.krsValue && (
                                <div className="krs-comparison">
                                  <div>
                                    <span>
                                      Data Akun
                                    </span>

                                    <strong>
                                      {
                                        issue.accountValue
                                      }
                                    </strong>
                                  </div>

                                  <div>
                                    <span>
                                      Data pada KRS
                                    </span>

                                    <strong>
                                      {issue.krsValue}
                                    </strong>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="krs-reupload-button"
                    onClick={handleReplaceFile}
                  >
                    <RefreshCw size={18} />
                    Ganti File
                  </button>
                </>
              )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default VerifyKrs