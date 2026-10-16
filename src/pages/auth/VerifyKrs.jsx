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
  X,
  XCircle,
} from 'lucide-react'

import AuthSidebar from '../../components/auth/AuthSidebar'

import '../../styles/auth/auth-layout.css'
import '../../styles/auth/verify-krs.css'

function VerifyKrs() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  /*
    Data Step 1 disimpan sementara
    di sessionStorage.
  */

  const registrationData = JSON.parse(
    sessionStorage.getItem('registrationData') || '{}'
  )

  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('upload')

  const [verificationIssues, setVerificationIssues] =
    useState([])

  /*
    POPUP ERROR FILE
  */

  const [fileModal, setFileModal] = useState(null)

  /*
    ============================================
    MOCK DATA HASIL PEMBACAAN KRS
    ============================================

    Nanti data ini diganti response backend.
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

  /*
    ============================================
    FORMAT UKURAN FILE
    ============================================
  */

  const formatFileSize = (size) => {
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  }

  /*
    ============================================
    TUTUP MODAL
    ============================================
  */

  const closeFileModal = () => {
    setFileModal(null)
  }

  /*
    Bisa tutup modal dengan tombol ESC.
  */

  useEffect(() => {
    if (!fileModal) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeFileModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [fileModal])

  /*
    ============================================
    VALIDASI FILE
    ============================================
  */

  const handleFile = (file) => {
    if (!file) return

    const allowedExtensions = [
      'pdf',
      'png',
      'jpg',
      'jpeg',
    ]

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || ''

    const maxSize = 2 * 1024 * 1024

    /*
      FORMAT SALAH
    */

    if (!allowedExtensions.includes(extension)) {
      setSelectedFile(null)
      setStatus('upload')

      setFileModal({
        title: 'Format file tidak didukung',
        message:
          'File yang Anda pilih tidak dapat diunggah.',
        detail:
          'Gunakan file dengan format PNG, JPG, JPEG, atau PDF.',
      })

      return
    }

    /*
      UKURAN TERLALU BESAR
    */

    if (file.size > maxSize) {
      setSelectedFile(null)
      setStatus('upload')

      setFileModal({
        title: 'Ukuran file terlalu besar',
        message: `Ukuran file yang dipilih adalah ${formatFileSize(
          file.size
        )}.`,
        detail:
          'Ukuran maksimal file yang dapat diunggah adalah 2 MB.',
      })

      return
    }

    /*
      FILE VALID
    */

    setVerificationIssues([])
    setSelectedFile(file)
    setStatus('upload')
  }

  /*
    ============================================
    PILIH FILE
    ============================================
  */

  const handleChange = (event) => {
    const file = event.target.files[0]

    handleFile(file)

    /*
      Reset input supaya file yang sama
      bisa dipilih kembali.
    */

    event.target.value = ''
  }

  /*
    ============================================
    DRAG & DROP
    ============================================
  */

  const handleDrop = (event) => {
    event.preventDefault()

    const file =
      event.dataTransfer.files[0]

    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  /*
    ============================================
    TIPE FILE
    ============================================
  */

  const getFileType = (file) => {
    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || ''

    if (extension === 'pdf') {
      return 'PDF'
    }

    if (extension === 'png') {
      return 'PNG'
    }

    if (extension === 'jpeg') {
      return 'JPEG'
    }

    return 'JPG'
  }

  /*
    ============================================
    NORMALISASI TEXT
    ============================================
  */

  const normalizeText = (text = '') => {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
  }

  /*
    ============================================
    LANJUT VERIFIKASI
    ============================================
  */

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
            registrationData.name ||
            'Tidak tersedia',

          krsValue:
            mockKrsData.name,
        })
      }

      /*
        CEK NIM
      */

      if (
        String(
          registrationData.nim || ''
        ) !== String(mockKrsData.nim)
      ) {
        issues.push({
          type: 'nim',
          title: 'NIM tidak sesuai',

          message:
            'NIM pada KRS tidak sesuai dengan NIM yang Anda daftarkan.',

          accountValue:
            registrationData.nim ||
            'Tidak tersedia',

          krsValue:
            mockKrsData.nim,
        })
      }

      /*
        CEK PROGRAM STUDI
      */

      if (
        normalizeText(
          mockKrsData.programStudi
        ) !== 'sistem informasi'
      ) {
        issues.push({
          type: 'program',

          title:
            'Program Studi tidak sesuai',

          message:
            'KRS yang diunggah bukan dari Program Studi Sistem Informasi.',
        })
      }

      /*
        CEK IDENTITAS PRADITA
      */

      if (
        !mockKrsData.hasPraditaIdentity
      ) {
        issues.push({
          type: 'identity',

          title:
            'Identitas Pradita tidak ditemukan',

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

          title:
            'KRS bukan periode aktif',

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

    return () =>
      clearTimeout(timer)
  }, [status])

  /*
    ============================================
    GANTI FILE
    ============================================
  */

  const handleReplaceFile = () => {
    setSelectedFile(null)

    setVerificationIssues([])

    setStatus('upload')

    setTimeout(() => {
      inputRef.current?.click()
    }, 0)
  }

  /*
    ============================================
    KIRIM OTP
    ============================================
  */

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

                  <h2>
                    Verifikasi KRS
                  </h2>

                  <p>
                    Unggah KRS terbaru untuk
                    memverifikasi data dan status
                    mahasiswa Anda.
                  </p>

                </div>

                <div className="krs-upload-section">

                  <label className="krs-label">
                    KRS Terbaru
                    <span>*</span>
                  </label>

                  {!selectedFile ? (

                    <div
                      className="krs-dropzone"
                      onDrop={handleDrop}
                      onDragOver={
                        handleDragOver
                      }
                    >

                      <div className="krs-upload-icon">
                        <FileUp size={25} />
                      </div>

                      <h3>
                        Tarik dan letakkan
                        Kartu Rencana Studi
                        di sini
                      </h3>

                      <p>
                        Format file dapat berupa
                        screenshot maupun PDF
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
                        PNG, JPG, JPEG, atau PDF •
                        Maksimal 2 MB
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
                          {getFileType(
                            selectedFile
                          )}{' '}
                          •{' '}
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
                    mencantumkan nama lengkap dan
                    NIM yang sesuai, Program Studi
                    Sistem Informasi, serta logo
                    Pradita.
                  </p>

                  {selectedFile && (
                    <button
                      type="button"
                      className="primary-button krs-continue-button"
                      onClick={
                        handleContinue
                      }
                    >
                      Lanjutkan

                      <ArrowRight
                        size={20}
                      />
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

                    <h2>
                      Verifikasi KRS
                    </h2>

                    <p>
                      Sistem sedang memeriksa
                      KRS yang Anda unggah.
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
                      Sistem sedang mencocokkan
                      data pada KRS dengan data
                      akun Anda.
                    </p>

                    <span>
                      Proses ini mencakup
                      pemeriksaan identitas dan
                      status mahasiswa.
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

                    <h2>
                      Verifikasi KRS
                    </h2>

                    <p>
                      KRS Anda berhasil
                      diverifikasi.
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

                      <CheckCircle2
                        size={16}
                      />

                      KRS Terverifikasi

                    </div>

                  </div>

                  <div className="krs-success-message">

                    <CheckCircle2
                      size={22}
                    />

                    <div>

                      <h3>
                        KRS Terverifikasi
                      </h3>

                      <p>
                        Data pada KRS telah
                        sesuai dengan informasi
                        akun Anda.
                      </p>

                    </div>

                  </div>

                  <div className="student-data-card">

                    <h3>
                      Data dari KRS
                    </h3>

                    <p className="student-data-description">
                      Data berikut diperoleh
                      dari KRS yang telah
                      diverifikasi.
                    </p>

                    <div className="student-data-grid">

                      <div className="student-data-item">

                        <span>
                          Nama Lengkap
                        </span>

                        <strong>
                          {
                            mockKrsData.name
                          }
                        </strong>

                      </div>

                      <div className="student-data-item">

                        <span>
                          NIM
                        </span>

                        <strong>
                          {
                            mockKrsData.nim
                          }
                        </strong>

                      </div>

                      <div className="student-data-item">

                        <span>
                          Program Studi
                        </span>

                        <strong>
                          {
                            mockKrsData.programStudi
                          }
                        </strong>

                      </div>

                      <div className="student-data-item">

                        <span>
                          Angkatan
                        </span>

                        <strong>
                          {
                            mockKrsData.angkatan
                          }
                        </strong>

                      </div>

                      <div className="student-data-item">

                        <span>
                          Semester
                        </span>

                        <strong>
                          {
                            mockKrsData.semester
                          }
                        </strong>

                      </div>

                      <div className="student-data-item">

                        <span>
                          Periode Akademik
                        </span>

                        <strong>
                          {
                            mockKrsData.periodeAkademik
                          }
                        </strong>

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="primary-button krs-send-otp-button"
                    onClick={
                      handleSendOtp
                    }
                  >
                    Kirim OTP

                    <ArrowRight
                      size={20}
                    />
                  </button>

                  <p className="krs-otp-helper">
                    OTP akan dikirim ke email
                    student yang Anda daftarkan.
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

                    <h2>
                      Verifikasi KRS
                    </h2>

                    <p>
                      KRS belum dapat
                      diverifikasi. Periksa
                      informasi di bawah ini.
                    </p>

                  </div>

                  <div className="krs-rejected-file-card">

                    <div className="krs-rejected-file-left">

                      <div className="krs-rejected-file-icon">

                        <FileText
                          size={24}
                        />

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

                      <XCircle
                        size={16}
                      />

                      Belum Terverifikasi

                    </div>

                  </div>

                  <div className="krs-rejected-message">

                    <CircleAlert
                      size={22}
                    />

                    <div>

                      <h3>
                        KRS Belum Terverifikasi
                      </h3>

                      <p>
                        Terdapat data pada KRS
                        yang tidak sesuai dengan
                        informasi akun Anda.
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

                          <XCircle
                            size={18}
                          />

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
                                      {
                                        issue.krsValue
                                      }
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
                    onClick={
                      handleReplaceFile
                    }
                  >
                    <RefreshCw
                      size={18}
                    />

                    Ganti File
                  </button>

                </>
              )}

          </div>

        </section>

      </div>

      {/* =========================
          POPUP ERROR FILE
      ========================== */}

      {fileModal && (

        <div
          className="krs-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeFileModal()
            }
          }}
        >

          <div
            className="krs-file-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="krs-file-modal-title"
          >

            <button
              type="button"
              className="krs-modal-close"
              onClick={
                closeFileModal
              }
              aria-label="Tutup"
            >
              <X size={19} />
            </button>

            <div className="krs-modal-icon">

              <CircleAlert
                size={26}
              />

            </div>

            <h2 id="krs-file-modal-title">
              {fileModal.title}
            </h2>

            <p className="krs-modal-message">
              {fileModal.message}
            </p>

            <p className="krs-modal-detail">
              {fileModal.detail}
            </p>

            <div className="krs-modal-rule">
              PNG, JPG, JPEG, atau PDF •
              Maksimal 2 MB
            </div>

            <button
              type="button"
              className="krs-modal-button"
              onClick={
                closeFileModal
              }
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </main>
  )
}

export default VerifyKrs