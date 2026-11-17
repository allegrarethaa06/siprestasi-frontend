import { usePortal, saveApplication } from '../../data/portal'
import { useState } from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  GraduationCap,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'

import '../../styles/student/pendaftaran-tahap1.css'

function PendaftaranTahap1() {
  const navigate = useNavigate()
  const location = useLocation()

  /*
    ============================================
    DATA DARI REVIEW
    ============================================

    Kalau mahasiswa kembali dari halaman Review
    untuk edit, data sebelumnya akan dipakai lagi.
  */

  const portal = usePortal()
  const previousData = location.state?.registrationData || portal.registrationData
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  /*
    ============================================
    DATA MAHASISWA
    ============================================

    Data mahasiswa berasal dari backend / master data.
  */

  const student = portal.student

  /*
    ============================================
    FORM DATA
    ============================================
  */

  const BAHASA_OPTIONS = [
    'Bahasa Inggris',
    'Bahasa Mandarin',
    'Bahasa Jepang',
    'Bahasa Korea',
    'Bahasa Jerman',
    'Bahasa Prancis',
    'Bahasa Arab',
    'Bahasa Spanyol',
    'Bahasa Belanda',
    'Bahasa Rusia',
    'Bahasa Italia',
  ]

  const LEGACY_BAHASA_MAP = {
    inggris: 'Bahasa Inggris',
    jepang: 'Bahasa Jepang',
    korea: 'Bahasa Korea',
    arab: 'Bahasa Arab',
    mandarin: 'Bahasa Mandarin',
    jerman: 'Bahasa Jerman',
    prancis: 'Bahasa Prancis',
  }

  const [showBahasaDropdown, setShowBahasaDropdown] = useState(false)

  const [formData, setFormData] = useState(
    {
      hasPrestasi: '',
      namaPrestasi: '',
      tingkatPrestasi: '',
      tahunPrestasi: '',
      penyelenggara: '',

      hasOrganisasi: '',
      namaOrganisasi: '',
      tingkatOrganisasi: '',
      jabatan: '',
      periode: '',

      hasBahasa: '',
      bahasa: '',
      tingkatSertifikat: '',
      skor: '',
      tanggalTes: '',
      lembagaPenerbit: '',
      tanggalKedaluwarsa: '',
      ...previousData?.formData,
      bahasa:
        LEGACY_BAHASA_MAP[previousData?.formData?.bahasa] ||
        previousData?.formData?.bahasa ||
        '',
    }
  )

  const bahasaQuery = (formData.bahasa || '').trim().toLowerCase()
  const filteredBahasaOptions = bahasaQuery
    ? BAHASA_OPTIONS.filter((opt) =>
        opt.toLowerCase().includes(bahasaQuery)
      )
    : BAHASA_OPTIONS

  /*
    ============================================
    FILE DATA
    ============================================
  */

  const [files, setFiles] = useState(
    previousData?.files || {
      prestasi: null,
      organisasi: null,
      bahasa: null,
    }
  )

  const [fileErrors, setFileErrors] = useState({
    prestasi: '',
    organisasi: '',
    bahasa: '',
  })

  /*
    ============================================
    KONFIGURASI FILE
    ============================================
  */

  const MAX_FILE_SIZE = 2 * 1024 * 1024

  const allowedExtensions = [
    'pdf',
    'jpg',
    'jpeg',
    'png',
  ]

  /*
    ============================================
    INPUT BIASA
    ============================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))
  }

  /*
    ============================================
    TAHUN PRESTASI
    ============================================
  */

  const handleYearChange = (event) => {
    const numericValue = event.target.value
      .replace(/\D/g, '')
      .slice(0, 4)

    setFormData((previousFormData) => ({
      ...previousFormData,
      tahunPrestasi: numericValue,
    }))
  }

  /*
    ============================================
    PRESTASI
    ============================================
  */

  const handlePrestasiChoice = (value) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      hasPrestasi: value,

      ...(value === 'tidak'
        ? {
            namaPrestasi: '',
            tingkatPrestasi: '',
            tahunPrestasi: '',
            penyelenggara: '',
          }
        : {}),
    }))

    if (value === 'tidak') {
      setFiles((previousFiles) => ({
        ...previousFiles,
        prestasi: null,
      }))

      setFileErrors((previousErrors) => ({
        ...previousErrors,
        prestasi: '',
      }))
    }
  }

  /*
    ============================================
    ORGANISASI
    ============================================
  */

  const handleOrganisasiChoice = (value) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      hasOrganisasi: value,

      ...(value === 'tidak'
        ? {
            namaOrganisasi: '',
            tingkatOrganisasi: '',
            jabatan: '',
            periode: '',
          }
        : {}),
    }))

    if (value === 'tidak') {
      setFiles((previousFiles) => ({
        ...previousFiles,
        organisasi: null,
      }))

      setFileErrors((previousErrors) => ({
        ...previousErrors,
        organisasi: '',
      }))
    }
  }

  /*
    ============================================
    BAHASA ASING
    ============================================
  */

  const handleBahasaChoice = (value) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      hasBahasa: value,

      ...(value === 'tidak'
        ? {
            bahasa: '',
            tingkatSertifikat: '',
            skor: '',
            tanggalTes: '',
            lembagaPenerbit: '',
            tanggalKedaluwarsa: '',
          }
        : {}),
    }))

    if (value === 'tidak') {
      setFiles((previousFiles) => ({
        ...previousFiles,
        bahasa: null,
      }))

      setFileErrors((previousErrors) => ({
        ...previousErrors,
        bahasa: '',
      }))
    }
  }

  /*
    ============================================
    FORMAT FILE
    ============================================
  */

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Tersimpan di server'
    if (bytes < 1024) {
      return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`
  }

  const getFileExtension = (fileName) => {
    return fileName
      .split('.')
      .pop()
      .toLowerCase()
  }

  /*
    ============================================
    UPLOAD FILE
    ============================================
  */

  const handleFileChange = (
    event,
    category
  ) => {
    const selectedFile =
      event.target.files[0]

    if (!selectedFile) {
      return
    }

    const extension =
      getFileExtension(
        selectedFile.name
      )

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setFileErrors(
        (previousErrors) => ({
          ...previousErrors,
          [category]:
            'Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG.',
        })
      )

      event.target.value = ''
      return
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFileErrors(
        (previousErrors) => ({
          ...previousErrors,
          [category]:
            'Ukuran file melebihi batas maksimal 2 MB.',
        })
      )

      event.target.value = ''
      return
    }

    setFiles((previousFiles) => ({
      ...previousFiles,
      [category]: selectedFile,
    }))

    setFileErrors(
      (previousErrors) => ({
        ...previousErrors,
        [category]: '',
      })
    )
  }

  /*
    ============================================
    HAPUS FILE
    ============================================
  */

  const handleRemoveFile = (
    category
  ) => {
    setFiles((previousFiles) => ({
      ...previousFiles,
      [category]: null,
    }))

    setFileErrors(
      (previousErrors) => ({
        ...previousErrors,
        [category]: '',
      })
    )
  }

  /*
    ============================================
    PREVIEW FILE
    ============================================
  */

  const handlePreviewFile = (file) => {
    if (!file) {
      return
    }

    const fileUrl =
      file.url || URL.createObjectURL(file)

    window.open(
      fileUrl,
      '_blank',
      'noopener,noreferrer'
    )

    setTimeout(() => {
      URL.revokeObjectURL(fileUrl)
    }, 60000)
  }

  /*
    ============================================
    CEK KELENGKAPAN PRESTASI
    ============================================
  */

  const isPrestasiComplete =
    formData.hasPrestasi ===
      'tidak' ||
    (
      formData.hasPrestasi ===
        'ya' &&
      formData.namaPrestasi.trim() !==
        '' &&
      formData.tingkatPrestasi !==
        '' &&
      formData.tahunPrestasi.length ===
        4 &&
      formData.penyelenggara.trim() !==
        '' &&
      files.prestasi !== null
    )

  /*
    ============================================
    CEK KELENGKAPAN ORGANISASI
    ============================================
  */

  const isOrganisasiComplete =
    formData.hasOrganisasi ===
      'tidak' ||
    (
      formData.hasOrganisasi ===
        'ya' &&
      formData.namaOrganisasi.trim() !==
        '' &&
      formData.tingkatOrganisasi !==
        '' &&
      formData.jabatan !== '' &&
      formData.periode.trim() !==
        '' &&
      files.organisasi !== null
    )

  /*
    ============================================
    CEK KELENGKAPAN BAHASA
    ============================================
  */

  const isBahasaComplete =
    formData.hasBahasa === 'tidak' ||
    (
      formData.hasBahasa === 'ya' &&
      formData.bahasa.trim() !== '' &&
      formData.tingkatSertifikat.trim() !==
        '' &&
      formData.skor.trim() !== '' &&
      formData.tanggalTes !== '' &&
      formData.lembagaPenerbit.trim() !==
        '' &&
      files.bahasa !== null
    )

  /*
    ============================================
    PROGRESS
    ============================================
  */

  const completedSections =
    1 +
    Number(isPrestasiComplete) +
    Number(isOrganisasiComplete) +
    Number(isBahasaComplete)

  const progressPercentage =
    (completedSections / 4) * 100

  /*
    ============================================
    STATUS
    ============================================
  */

  const getPrestasiStatus = () => {
    if (
      formData.hasPrestasi === ''
    ) {
      return 'Belum Terisi'
    }

    if (
      formData.hasPrestasi ===
      'tidak'
    ) {
      return 'Tidak Ada'
    }

    if (isPrestasiComplete) {
      return 'Terisi'
    }

    return 'Sedang Diisi'
  }

  const getOrganisasiStatus = () => {
    if (
      formData.hasOrganisasi === ''
    ) {
      return 'Belum Terisi'
    }

    if (
      formData.hasOrganisasi ===
      'tidak'
    ) {
      return 'Tidak Ada'
    }

    if (isOrganisasiComplete) {
      return 'Terisi'
    }

    return 'Sedang Diisi'
  }

  const getBahasaStatus = () => {
    if (formData.hasBahasa === '') {
      return 'Belum Terisi'
    }

    if (
      formData.hasBahasa ===
      'tidak'
    ) {
      return 'Tidak Ada'
    }

    if (isBahasaComplete) {
      return 'Terisi'
    }

    return 'Sedang Diisi'
  }

  const hasStarted =
    formData.hasPrestasi !== '' ||
    formData.hasOrganisasi !== '' ||
    formData.hasBahasa !== ''

  const isAllComplete =
    completedSections === 4

  const getRegistrationStatus = () => {
    if (isAllComplete) {
      return 'Siap Direview'
    }

    if (hasStarted) {
      return 'Draft'
    }

    return 'Belum Dimulai'
  }

  /*
    ============================================
    NAVIGATION
    ============================================
  */

  const handleBackDashboard = () => {
    navigate('/dashboard')
  }

  /*
    ============================================
    SIMPAN DRAFT
    ============================================
  */

  const handleSaveDraft = async () => {
    if (saving) return
    setSaving(true)
    setSaveMessage('')
    setSaveError('')
    try {
      await saveApplication({ student, formData, files })
      setSaveMessage('Draft berhasil disimpan! Mengalihkan ke Dashboard...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    } catch (error) {
      setSaveError(error.message || 'Gagal menyimpan draft.')
    } finally {
      setSaving(false)
    }
  }

  /*
    ============================================
    LANJUT KE REVIEW
    ============================================
  */

  const handleReview = () => {
    if (!isAllComplete) {
      return
    }

    navigate(
      '/pendaftaran-mapres/review',
      {
        state: {
          registrationData: {
            student,
            formData,
            files,
          },
        },
      }
    )
  }

  /*
    ============================================
    FILE UPLOAD
    ============================================
  */

  const renderFileUpload = (
    category,
    label,
    emptyTitle
  ) => {
    const selectedFile =
      files[category]

    const error =
      fileErrors[category]

    return (
      <div className="registration-upload-wrapper">
        <label className="registration-upload-label">
          {label}
          <span>*</span>
        </label>

        {!selectedFile && (
          <label className="registration-upload-box">
            <Upload size={25} />

            <strong>
              {emptyTitle}
            </strong>

            <span>
              Tarik file ke area ini atau
              klik untuk memilih dokumen.
            </span>

            <div className="registration-upload-button">
              Pilih File
            </div>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onClick={(event) => {
                event.currentTarget.value =
                  ''
              }}
              onChange={(event) =>
                handleFileChange(
                  event,
                  category
                )
              }
            />
          </label>
        )}

        {selectedFile && (
          <div className="uploaded-file-card">
            <div className="uploaded-file-icon">
              <FileText size={22} />
            </div>

            <div className="uploaded-file-content">
              <strong>
                {selectedFile.name}
              </strong>

              <span>
                {formatFileSize(
                  selectedFile.size
                )}
              </span>

              <div className="uploaded-file-success">
                <CheckCircle2
                  size={13}
                />

                Dokumen berhasil diunggah
              </div>
            </div>

            <div className="uploaded-file-actions">
              <button
                type="button"
                className="file-view-button"
                onClick={() =>
                  handlePreviewFile(
                    selectedFile
                  )
                }
              >
                <Eye size={15} />
                Lihat
              </button>

              <button
                type="button"
                className="file-delete-button"
                aria-label="Hapus file"
                onClick={() =>
                  handleRemoveFile(
                    category
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="registration-file-error">
            <AlertCircle size={14} />

            <span>
              {error}
            </span>
          </div>
        )}

        <small>
          PDF, JPG, JPEG, PNG • Maksimal
          2 MB
        </small>
      </div>
    )
  }

  return (
    <div className="registration-page">
      <div className="registration-page-container">
        {saveMessage && (
          <div className="draft-toast draft-toast-success" role="status">
            <CheckCircle2 size={18} />
            <span>{saveMessage}</span>
          </div>
        )}
        {saveError && (
          <div className="draft-toast draft-toast-error" role="alert">
            <AlertCircle size={18} />
            <span>{saveError}</span>
          </div>
        )}

        {/* BACK */}

        <button
          type="button"
          className="registration-back-button"
          onClick={
            handleBackDashboard
          }
        >
          <ArrowLeft size={17} />
          Kembali ke Dashboard
        </button>

        {/* HEADER */}

        <section className="registration-header-card">
          <div>
            <div className="registration-header-title-row">
              <h1>
                Pendaftaran Mahasiswa
                Berprestasi
              </h1>

              <span className="registration-header-status">
                {getRegistrationStatus()}
              </span>
            </div>

            <p>
              Lengkapi data Tahap 1 sebelum
              mengirim pendaftaran.
            </p>
          </div>

          <div className="registration-progress-box">
            <div className="registration-progress-title">
              <span>
                Pengisian Tahap 1
              </span>

              <strong>
                {completedSections} dari 4
                bagian selesai
              </strong>
            </div>

            <div className="registration-progress-bar">
              <div
                className="registration-progress-value"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <span className="registration-progress-text">
              Progress Pengisian{' '}
              {progressPercentage}%
            </span>
          </div>
        </section>

        {/* DATA MAHASISWA */}

        <section className="registration-section-card">
          <div className="registration-section-heading">
            <div className="registration-section-number">
              1
            </div>

            <div className="registration-section-heading-main">
              <div className="registration-section-title-row">
                <h2>
                  Data Mahasiswa
                </h2>

                <span className="registration-section-status">
                  Tervalidasi
                </span>
              </div>

              <p>
                Data mahasiswa diambil
                otomatis dari profil dan
                master akademik.
              </p>
            </div>
          </div>

          <div className="registration-divider" />

          <div className="student-data-grid">
            <div className="readonly-field">
              <label>
                Nama Mahasiswa
              </label>

              <div className="readonly-value">
                {student.name}
              </div>
            </div>

            <div className="readonly-field">
              <label>
                Angkatan
              </label>

              <div className="readonly-value">
                {student.angkatan}
              </div>
            </div>
          </div>

          <div className="academic-sync-card">
            <div className="academic-sync-header">
              <div>
                <GraduationCap
                  size={17}
                />

                <span>
                  INFORMASI AKADEMIK
                  TERSINKRONISASI
                </span>
              </div>

              <span className="academic-sync-badge">
                Data otomatis
              </span>
            </div>

            <div className="academic-data-grid">
              <article className="academic-data-item">
                <span className="academic-data-label">
                  NIM
                </span>

                <strong>
                  {student.nim}
                </strong>

                <span className="academic-data-status">
                  Tersinkron
                </span>
              </article>
            </div>

            <p className="academic-sync-note">
              NIM diverifikasi otomatis dari master data akademik mahasiswa.
            </p>
          </div>
        </section>

        {/* PRESTASI */}

        <section className="registration-section-card">
          <div className="registration-section-heading">
            <div className="registration-section-number">
              2
            </div>

            <div className="registration-section-heading-main">
              <div className="registration-section-title-row">
                <h2>
                  Prestasi Terbaik
                </h2>

                <span className="registration-section-status">
                  {getPrestasiStatus()}
                </span>
              </div>

              <p>
                Masukkan satu prestasi
                terbaik yang ingin diajukan.
              </p>
            </div>
          </div>

          <div className="registration-divider" />

          <div className="registration-question-box">
            <div>
              <strong>
                Apakah Anda memiliki
                prestasi unggulan yang ingin
                diajukan?
              </strong>

              <span>
                Pilih 1 prestasi terbaik
                yang ingin digunakan dalam
                penilaian.
              </span>
            </div>

            <div className="registration-radio-group">
              <label>
                <input
                  type="radio"
                  name="hasPrestasi"
                  value="ya"
                  checked={
                    formData.hasPrestasi ===
                    'ya'
                  }
                  onChange={() =>
                    handlePrestasiChoice(
                      'ya'
                    )
                  }
                />
                Ya, Ada
              </label>

              <label>
                <input
                  type="radio"
                  name="hasPrestasi"
                  value="tidak"
                  checked={
                    formData.hasPrestasi ===
                    'tidak'
                  }
                  onChange={() =>
                    handlePrestasiChoice(
                      'tidak'
                    )
                  }
                />
                Tidak Ada
              </label>
            </div>
          </div>

          {formData.hasPrestasi ===
            'ya' && (
            <>
              <div className="registration-form-grid">
                <div className="registration-field registration-field-full">
                  <label>
                    Nama Prestasi
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="namaPrestasi"
                    value={
                      formData.namaPrestasi
                    }
                    onChange={handleChange}
                    placeholder="Masukkan judul prestasi"
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Tingkat Prestasi
                    <span>*</span>
                  </label>

                  <select
                    name="tingkatPrestasi"
                    value={
                      formData.tingkatPrestasi
                    }
                    onChange={handleChange}
                  ><option value="">Pilih tingkat prestasi</option><option value="internasional_juara">Internasional — Juara</option>
<option value="internasional_finalis">Internasional — Finalis</option>
<option value="nasional_juara">Nasional — Juara</option>
<option value="nasional_finalis">Nasional — Finalis</option>
<option value="regional_juara">Regional — Juara</option>
<option value="regional_finalis">Regional — Finalis</option>
<option value="universitas_juara">Universitas — Juara</option>
<option value="universitas_finalis">Universitas — Finalis</option></select>
                </div>

                <div className="registration-field">
                  <label>
                    Tahun Prestasi
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    name="tahunPrestasi"
                    value={
                      formData.tahunPrestasi
                    }
                    onChange={
                      handleYearChange
                    }
                    placeholder="Contoh: 2026"
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Penyelenggara
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="penyelenggara"
                    value={
                      formData.penyelenggara
                    }
                    onChange={handleChange}
                    placeholder="Nama penyelenggara"
                  />
                </div>
              </div>

              {renderFileUpload(
                'prestasi',
                'Upload Bukti Prestasi',
                'Belum ada dokumen diunggah'
              )}
            </>
          )}
        </section>

        {/* ORGANISASI */}

        <section className="registration-section-card">
          <div className="registration-section-heading">
            <div className="registration-section-number">
              3
            </div>

            <div className="registration-section-heading-main">
              <div className="registration-section-title-row">
                <h2>
                  Organisasi
                </h2>

                <span className="registration-section-status">
                  {getOrganisasiStatus()}
                </span>
              </div>

              <p>
                Masukkan pengalaman
                organisasi yang ingin
                digunakan dalam penilaian.
              </p>
            </div>
          </div>

          <div className="registration-divider" />

          <div className="registration-question-box">
            <div>
              <strong>
                Apakah Anda memiliki
                pengalaman kepengurusan
                organisasi?
              </strong>

              <span>
                Pilih 1 pengalaman
                organisasi yang ingin
                digunakan dalam penilaian.
              </span>
            </div>

            <div className="registration-radio-group">
              <label>
                <input
                  type="radio"
                  name="hasOrganisasi"
                  value="ya"
                  checked={
                    formData.hasOrganisasi ===
                    'ya'
                  }
                  onChange={() =>
                    handleOrganisasiChoice(
                      'ya'
                    )
                  }
                />
                Ya, Ada
              </label>

              <label>
                <input
                  type="radio"
                  name="hasOrganisasi"
                  value="tidak"
                  checked={
                    formData.hasOrganisasi ===
                    'tidak'
                  }
                  onChange={() =>
                    handleOrganisasiChoice(
                      'tidak'
                    )
                  }
                />
                Tidak Ada
              </label>
            </div>
          </div>

          {formData.hasOrganisasi ===
            'ya' && (
            <>
              <div className="registration-form-grid">
                <div className="registration-field">
                  <label>
                    Nama Organisasi
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="namaOrganisasi"
                    value={
                      formData.namaOrganisasi
                    }
                    onChange={handleChange}
                    placeholder="Nama organisasi"
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Tingkat Organisasi
                    <span>*</span>
                  </label>

                  <select
  name="tingkatOrganisasi"
  value={formData.tingkatOrganisasi}
  onChange={handleChange}
>
  <option value="" disabled hidden>Pilih tingkat organisasi</option>
  <option value="internasional">Internasional</option>
  <option value="nasional">Nasional</option>
  <option value="provinsi">Provinsi</option>
  <option value="kabupaten-kota">Kabupaten / Kota</option>
  <option value="kecamatan">Kecamatan</option>
  <option value="kampus">Kampus</option>
  <option value="sekolah">Sekolah</option>
</select>
                </div>

                <div className="registration-field">
                  <label>
                    Jabatan / Peran
                    <span>*</span>
                  </label>

                  <select
  name="jabatan"
  value={formData.jabatan}
  onChange={handleChange}
>
  <option value="" disabled hidden>Pilih jabatan</option>
  <option value="ketua">Ketua</option>
  <option value="wakil-ketua">Wakil Ketua</option>
  <option value="sekretaris">Sekretaris</option>
  <option value="bendahara">Bendahara</option>
  <option value="koordinator-divisi">Koordinator Divisi</option>
  <option value="anggota">Anggota</option>
</select>
                </div>

                <div className="registration-field">
                  <label>
                    Periode
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="periode"
                    value={
                      formData.periode
                    }
                    onChange={handleChange}
                    placeholder="Contoh: 2025-2026"
                  />
                </div>
              </div>

              {renderFileUpload(
                'organisasi',
                'Upload Bukti Organisasi',
                'Belum ada dokumen diunggah'
              )}
            </>
          )}
        </section>

        {/* BAHASA ASING */}

        <section className="registration-section-card">
          <div className="registration-section-heading">
            <div className="registration-section-number">
              4
            </div>

            <div className="registration-section-heading-main">
              <div className="registration-section-title-row">
                <h2>
                  Bahasa Asing
                </h2>

                <span className="registration-section-status">
                  {getBahasaStatus()}
                </span>
              </div>

              <p>
                Masukkan sertifikat
                kemampuan bahasa asing yang
                ingin diajukan.
              </p>
            </div>
          </div>

          <div className="registration-divider" />

          <div className="registration-question-box">
            <div>
              <strong>
                Apakah Anda memiliki
                sertifikat bahasa asing yang
                ingin diajukan?
              </strong>

              <span>
                Jika tidak memiliki
                sertifikat bahasa asing,
                pilih Tidak Ada.
              </span>
            </div>

            <div className="registration-radio-group">
              <label>
                <input
                  type="radio"
                  name="hasBahasa"
                  value="ya"
                  checked={
                    formData.hasBahasa ===
                    'ya'
                  }
                  onChange={() =>
                    handleBahasaChoice(
                      'ya'
                    )
                  }
                />
                Ya, Ada
              </label>

              <label>
                <input
                  type="radio"
                  name="hasBahasa"
                  value="tidak"
                  checked={
                    formData.hasBahasa ===
                    'tidak'
                  }
                  onChange={() =>
                    handleBahasaChoice(
                      'tidak'
                    )
                  }
                />
                Tidak Ada
              </label>
            </div>
          </div>

          {formData.hasBahasa ===
            'ya' && (
            <>
              <div className="bahasa-guide-strip">
                <div className="bahasa-guide-header">
                  <AlertCircle size={14} />
                  <span>Panduan Kategori Tingkat Sertifikat</span>
                </div>
                <div className="bahasa-guide-grid">
                  <div className="bahasa-guide-card">
                    <strong>Tingkat Tinggi</strong>
                    <span>TOEFL ITP ≥ 550 / IELTS ≥ 6.5 / TOPIK 5–6 / JLPT N1–N2 / setara</span>
                  </div>
                  <div className="bahasa-guide-card">
                    <strong>Tingkat Menengah Atas</strong>
                    <span>TOEFL ITP 500–549 / IELTS 6.0 / TOPIK 4 / JLPT N3 / setara</span>
                  </div>
                  <div className="bahasa-guide-card">
                    <strong>Tingkat Menengah</strong>
                    <span>TOEFL ITP 450–499 / IELTS 5.0–5.5 / TOPIK 3 / JLPT N4 / setara</span>
                  </div>
                  <div className="bahasa-guide-card">
                    <strong>Tingkat Dasar</strong>
                    <span>TOEFL ITP &lt; 450 / IELTS &lt; 5.0 / TOPIK 1–2 / JLPT N5 / setara</span>
                  </div>
                </div>
              </div>

              <div className="registration-form-grid">
                <div className="registration-field bahasa-autocomplete-field">
                  <label>
                    Bahasa
                    <span>*</span>
                  </label>

                  <div className="bahasa-autocomplete-wrapper">
                    <input
                      type="text"
                      name="bahasa"
                      value={formData.bahasa}
                      onChange={(e) => {
                        handleChange(e)
                        setShowBahasaDropdown(true)
                      }}
                      onFocus={() => setShowBahasaDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowBahasaDropdown(false), 160)
                      }
                      placeholder="Ketik atau pilih bahasa (misal: Bahasa Jerman)"
                      autoComplete="off"
                    />

                    {showBahasaDropdown && filteredBahasaOptions.length > 0 && (
                      <ul className="bahasa-suggestions-dropdown" role="listbox">
                        {filteredBahasaOptions.map((option) => (
                          <li
                            key={option}
                            role="option"
                            aria-selected={formData.bahasa === option}
                            className={
                              formData.bahasa === option ? 'is-selected' : ''
                            }
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setFormData((prev) => ({
                                ...prev,
                                bahasa: option,
                              }))
                              setShowBahasaDropdown(false)
                            }}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="registration-field">
                  <label>
                    Tingkat Sertifikat
                    <span>*</span>
                  </label>

                  <select
                    name="tingkatSertifikat"
                    value={formData.tingkatSertifikat}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Pilih tingkat sertifikat
                    </option>
                    <option value="tinggi">Tingkat Tinggi</option>
                    <option value="menengah_atas">Tingkat Menengah Atas</option>
                    <option value="menengah">Tingkat Menengah</option>
                    <option value="dasar">Tingkat Dasar</option>
                  </select>
                </div>

                <div className="registration-field">
                  <label>
                    Skor / Level
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="skor"
                    value={
                      formData.skor
                    }
                    onChange={handleChange}
                    placeholder="Masukkan skor atau level"
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Tanggal Tes / Terbit
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="tanggalTes"
                    value={
                      formData.tanggalTes
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Lembaga Penerbit
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="lembagaPenerbit"
                    value={
                      formData.lembagaPenerbit
                    }
                    onChange={handleChange}
                    placeholder="Nama lembaga penerbit"
                  />
                </div>

                <div className="registration-field">
                  <label>
                    Tanggal Kedaluwarsa
                  </label>

                  <input
                    type="date"
                    name="tanggalKedaluwarsa"
                    value={
                      formData.tanggalKedaluwarsa
                    }
                    onChange={handleChange}
                  />

                  <small>
                    Opsional jika tidak
                    tercantum pada
                    sertifikat.
                  </small>
                </div>
              </div>

              {renderFileUpload(
                'bahasa',
                'Upload Sertifikat Bahasa Asing',
                'Belum ada sertifikat diunggah'
              )}
            </>
          )}
        </section>

        {/* VERIFICATION */}

        <section className="verification-notice">
          <FileText size={18} />

          <div>
            <strong>
              Pemberitahuan Verifikasi
              Dokumen
            </strong>

            <span>
              Dokumen yang diunggah akan
              diperiksa oleh sistem untuk
              membantu proses verifikasi.
            </span>
          </div>
        </section>

        {/* ACTION */}

        <section className="registration-actions">
          <button
            type="button"
            className="save-draft-button"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Menyimpan Draft...' : 'Simpan Draft'}
          </button>

          <div className="registration-next-area">
            <span>
              {isAllComplete
                ? 'Semua bagian sudah lengkap. Lanjutkan ke Review.'
                : 'Lengkapi seluruh bagian sebelum melanjutkan ke Review.'}
            </span>

            <button
              type="button"
              className="registration-next-button"
              onClick={handleReview}
              disabled={!isAllComplete}
            >
              Lanjut ke Review
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PendaftaranTahap1
