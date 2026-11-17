import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { usePortal } from '../../data/portal'
import PasswordStrength from '../../components/auth/PasswordStrength'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  Camera,
  LogOut,
  ZoomIn,
  ZoomOut,
  Trash2,
  ArrowLeft,
} from 'lucide-react'

import '../../styles/auth/register.css'
import './StudentProfile.css'

const CROP_SIZE = 240
const OUTPUT_SIZE = 512

function StudentProfile() {
  const navigate = useNavigate()
  const portalData = usePortal()
  const student = portalData?.student || {}

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'password'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // ── Upload & Crop Foto ──────────────────────────────────
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState(null)
  const [imgNatural, setImgNatural] = useState({ width: 1, height: 1 })
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 })
  const imgElementRef = useRef(null)
  const fileInputRef = useRef(null)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  // ── Ubah Password ────────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [isChangingPw, setIsChangingPw] = useState(false)
  const [pwSuccessCard, setPwSuccessCard] = useState(false)
  const [pwError, setPwError] = useState(null)

  const initials = student.name
    ? student.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'M'

  const newPwValid =
    passwordData.new_password.length >= 8 &&
    /[a-z]/.test(passwordData.new_password) &&
    /[A-Z]/.test(passwordData.new_password) &&
    /\d/.test(passwordData.new_password) &&
    /[^A-Za-z0-9]/.test(passwordData.new_password)

  const pwMatch =
    passwordData.confirm_password.length > 0 &&
    passwordData.confirm_password === passwordData.new_password
  const pwMismatch =
    passwordData.confirm_password.length > 0 &&
    passwordData.confirm_password !== passwordData.new_password

  // ── Photo Crop Helpers ───────────────────────────────────
  const openPhotoModal = () => {
    setShowPhotoModal(true)
    setRawImageSrc(null)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    setUploadError(null)
    setUploadSuccess(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadError('Gunakan format foto JPG atau PNG.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran foto maksimal 5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        setImgNatural({ width: img.width, height: img.height })
        setZoom(1)
        setOffset({ x: 0, y: 0 })
        setRawImageSrc(reader.result)
        setUploadError(null)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const baseScale =
    CROP_SIZE / Math.min(imgNatural.width || 1, imgNatural.height || 1)
  const displayWidth = imgNatural.width * baseScale * zoom
  const displayHeight = imgNatural.height * baseScale * zoom

  const clampOffset = (nx, ny, nextZoom = zoom) => {
    const w = imgNatural.width * baseScale * nextZoom
    const h = imgNatural.height * baseScale * nextZoom
    const maxX = Math.max(0, (w - CROP_SIZE) / 2)
    const maxY = Math.max(0, (h - CROP_SIZE) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, nx)),
      y: Math.max(-maxY, Math.min(maxY, ny)),
    }
  }

  const handlePointerDown = (e) => {
    if (!rawImageSrc) return
    e.preventDefault()
    setDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    }
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setOffset(
      clampOffset(dragStartRef.current.ox + dx, dragStartRef.current.oy + dy)
    )
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  const handleZoomChange = (nextZoomValue) => {
    const z = Number(nextZoomValue)
    setZoom(z)
    setOffset((prev) => clampOffset(prev.x, prev.y, z))
  }

  const buildCroppedBlob = () =>
    new Promise((resolve, reject) => {
      const img = imgElementRef.current
      if (!img) {
        reject(new Error('Gambar belum siap.'))
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_SIZE
      canvas.height = OUTPUT_SIZE
      const ctx = canvas.getContext('2d')

      const effectiveScale = baseScale * zoom
      const imgLeft = (CROP_SIZE - displayWidth) / 2 + offset.x
      const imgTop = (CROP_SIZE - displayHeight) / 2 + offset.y

      const sx = -imgLeft / effectiveScale
      const sy = -imgTop / effectiveScale
      const sSize = CROP_SIZE / effectiveScale

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      ctx.drawImage(
        img,
        sx,
        sy,
        sSize,
        sSize,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
      )

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Gagal memproses gambar.'))
        },
        'image/jpeg',
        0.92
      )
    })

  const handleUploadPhoto = async () => {
    if (!rawImageSrc || isUploading) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const croppedBlob = await buildCroppedBlob()
      const formData = new FormData()
      formData.append('picture', croppedBlob, 'profile.jpg')
      await api('profile/picture', { method: 'POST', body: formData })
      setUploadSuccess(true)
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah foto.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (isUploading) return
    setIsUploading(true)
    setUploadError(null)
    try {
      await api('profile/picture', { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      setUploadError(err.message || 'Gagal menghapus foto.')
      setIsUploading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError(null)

    if (!newPwValid) {
      setPwError(
        'Kata sandi baru wajib minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, serta simbol.'
      )
      return
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPwError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.')
      return
    }

    setIsChangingPw(true)
    try {
      await api('profile/password', {
        method: 'PUT',
        body: passwordData,
      })
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
      setPwSuccessCard(true)
    } catch (err) {
      setPwError(err.message || 'Gagal mengubah kata sandi.')
    } finally {
      setIsChangingPw(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api('auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    navigate('/login', { replace: true })
  }

  return (
    <div className="sp-page">
      <main className="sp-container">
        {/* TOP BAR BACK + TITLE */}
        <div className="sp-topbar-row">
          <button
            type="button"
            className="sp-back-button"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} />
            Kembali ke Dashboard
          </button>
        </div>

        <div className="sp-page-heading">
          <h1>Pengaturan Akun</h1>
          <p>
            Kelola foto profil, informasi identitas akun, dan keamanan kata
            sandi Anda.
          </p>
        </div>

        {/* SPLIT SHELL (SIDEBAR KIRI + PANEL KANAN) */}
        <div className="sp-shell">
          {/* SIDEBAR KIRI */}
          <aside className="sp-sidebar">
            <div className="sp-sidebar-group">
              <span className="sp-sidebar-label">MENU AKUN</span>

              <button
                type="button"
                className={`sp-nav-item ${
                  activeTab === 'profile' ? 'is-active' : ''
                }`}
                onClick={() => {
                  setActiveTab('profile')
                  setPwSuccessCard(false)
                }}
              >
                <User size={17} />
                <span>Profil Saya</span>
              </button>

              <button
                type="button"
                className={`sp-nav-item ${
                  activeTab === 'password' ? 'is-active' : ''
                }`}
                onClick={() => {
                  setActiveTab('password')
                  setPwError(null)
                }}
              >
                <Lock size={17} />
                <span>Ubah Kata Sandi</span>
              </button>
            </div>

            <button
              type="button"
              className="sp-sidebar-logout sp-logout-desktop"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut size={17} />
              <span>Keluar Akun</span>
            </button>
          </aside>

          {/* PANEL KANAN */}
          <div
            className={`sp-main-area ${
              activeTab === 'password' ? 'is-password-tab' : ''
            }`}
          >
            {/* HEADER BANNER DEKORATIF (TANPA TOMBOL GANTI FOTO) */}
            <div className="sp-banner">
              <div className="sp-banner-pattern" />
              <div className="sp-banner-badge">
                SIPRESTASI • Sistem Informasi
              </div>
            </div>

            {/* 2-COLUMN CARDS BELOW BANNER */}
            <div className="sp-cards-grid">
              {/* CARD KIRI: PROFILE SUMMARY (TANPA DUPLIKASI NIM & STATUS) */}
              <section className="sp-card sp-profile-card">
                <div className="sp-card-top">
                  <h3>Profil Mahasiswa</h3>
                </div>

                <div className="sp-avatar-wrap">
                  <div className="sp-avatar-circle">
                    {student.picture ? (
                      <img
                        src={student.picture}
                        alt={student.name || 'Foto Profil'}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                </div>

                <div className="sp-identity-center">
                  <h2>{student.name || '—'}</h2>
                  <p className="sp-uni-subtitle">Pradita University</p>
                  <span className="sp-verified-pill">
                    Mahasiswa Terverifikasi
                  </span>
                </div>

                <button
                  type="button"
                  className="sp-left-photo-btn"
                  onClick={openPhotoModal}
                >
                  <Camera size={15} />
                  <span>Ubah Foto Profil</span>
                </button>
              </section>

              {/* CARD KANAN: INFORMASI AKUN ATAU UBAH KATA SANDI */}
              {activeTab === 'profile' ? (
                <section className="sp-card sp-detail-card">
                  <div className="sp-card-header">
                    <div>
                      <h2>Informasi Akun</h2>
                      <p>
                        Informasi identitas akun yang digunakan pada sistem.
                      </p>
                    </div>
                  </div>

                  <div className="sp-info-grid">
                    <div className="sp-info-item sp-info-item-wide">
                      <span className="sp-info-label">Nama Lengkap</span>
                      <strong>{student.name || '—'}</strong>
                    </div>

                    <div className="sp-info-item sp-info-item-wide">
                      <span className="sp-info-label">Email</span>
                      <strong>{student.email || '—'}</strong>
                    </div>

                    <div className="sp-info-item">
                      <span className="sp-info-label">NIM</span>
                      <strong>{student.nim || '—'}</strong>
                    </div>

                    <div className="sp-info-item">
                      <span className="sp-info-label">Program Studi</span>
                      <strong>Sistem Informasi</strong>
                    </div>

                    <div className="sp-info-item">
                      <span className="sp-info-label">Angkatan</span>
                      <strong>{student.angkatan || '—'}</strong>
                    </div>

                    <div className="sp-info-item">
                      <span className="sp-info-label">Status Akun</span>
                      <div className="sp-account-status">
                        <span className="sp-status-dot" />
                        Aktif
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="sp-card sp-detail-card">
                  {pwSuccessCard ? (
                    <div className="sp-pw-success-card">
                      <div className="sp-pw-success-icon">
                        <CheckCircle2 size={36} />
                      </div>
                      <h2>Kata Sandi Berhasil Diperbarui!</h2>
                      <p>
                        Kata sandi akun SIPRESTASI Anda telah berhasil diganti
                        dan langsung aktif. Gunakan kata sandi baru ini saat
                        Anda masuk kembali.
                      </p>
                      <div className="sp-pw-success-actions">
                        <button
                          type="button"
                          className="sp-pw-submit"
                          onClick={() => {
                            setPwSuccessCard(false)
                            setActiveTab('profile')
                          }}
                        >
                          Kembali ke Profil Saya
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="sp-card-header">
                        <div>
                          <h2>Ubah Kata Sandi</h2>
                          <p>
                            Perbarui kata sandi untuk mengamankan akun mahasiswa
                            Anda.
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handlePasswordChange}
                        className="sp-pw-form"
                        noValidate
                      >
                        {pwError && (
                          <div className="sp-alert sp-alert-error">
                            <AlertCircle size={16} />
                            <span>{pwError}</span>
                          </div>
                        )}

                        <div className="sp-pw-field">
                          <label>Kata Sandi Saat Ini *</label>
                          <div className="password-input">
                            <input
                              type={showCurrentPw ? 'text' : 'password'}
                              placeholder="Masukkan kata sandi saat ini"
                              value={passwordData.current_password}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  current_password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowCurrentPw(!showCurrentPw)}
                            >
                              {showCurrentPw ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="sp-pw-field">
                          <label>Kata Sandi Baru *</label>
                          <div className="password-input">
                            <input
                              type={showNewPw ? 'text' : 'password'}
                              placeholder="Masukkan kata sandi baru"
                              value={passwordData.new_password}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  new_password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowNewPw(!showNewPw)}
                            >
                              {showNewPw ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          <PasswordStrength
                            password={passwordData.new_password}
                          />
                        </div>

                        <div className="sp-pw-field">
                          <label>Konfirmasi Kata Sandi Baru *</label>
                          <div
                            className={`password-input ${
                              pwMismatch ? 'input-error' : ''
                            }`}
                          >
                            <input
                              type={showConfirmPw ? 'text' : 'password'}
                              placeholder="Ulangi kata sandi baru"
                              value={passwordData.confirm_password}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirm_password: e.target.value,
                                })
                              }
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onClick={() => setShowConfirmPw(!showConfirmPw)}
                            >
                              {showConfirmPw ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          {pwMatch && (
                            <p className="password-match">
                              <CheckCircle2 size={15} />
                              Kata sandi cocok
                            </p>
                          )}
                          {pwMismatch && (
                            <p className="password-mismatch">
                              Kata sandi belum cocok
                            </p>
                          )}
                        </div>

                        <div className="sp-pw-action">
                          <button
                            type="submit"
                            className="sp-pw-submit"
                            disabled={
                              isChangingPw ||
                              !passwordData.current_password ||
                              !newPwValid ||
                              !pwMatch
                            }
                          >
                            {isChangingPw ? (
                              <>
                                <LoaderCircle size={16} className="sp-spin" />
                                Menyimpan...
                              </>
                            ) : (
                              'Simpan Kata Sandi Baru'
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </section>
              )}
            </div>

            <button
              type="button"
              className="sp-sidebar-logout sp-logout-mobile"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut size={17} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>

        {/* LOGOUT CONFIRM MODAL */}
        {showLogoutConfirm && (
          <div className="sp-modal-overlay">
            <div className="sp-modal">
              <div className="sp-modal-icon">
                <LogOut size={22} />
              </div>
              <h2>Keluar dari Akun?</h2>
              <p>Apakah Anda yakin ingin keluar dari akun SIPRESTASI?</p>
              <div className="sp-modal-actions">
                <button
                  type="button"
                  className="sp-modal-cancel"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="sp-modal-confirm"
                  onClick={handleLogout}
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD & CROP FOTO MODAL */}
        {showPhotoModal && (
          <div className="sp-modal-overlay">
            <div className="sp-modal sp-photo-modal">
              <div className="sp-photo-modal-header">
                <h3>Foto Profil Mahasiswa</h3>
                <button
                  type="button"
                  className="sp-photo-close"
                  onClick={() => setShowPhotoModal(false)}
                >
                  ✕
                </button>
              </div>

              <p className="sp-photo-desc">
                Unggah dan sesuaikan posisi foto Anda. Foto ini ditampilkan pada
                profil dan <strong>podium pemenang (Top 3)</strong>.
              </p>

              {rawImageSrc ? (
                <div className="sp-cropper-area">
                  <div
                    className="sp-crop-viewport"
                    style={{ width: CROP_SIZE, height: CROP_SIZE }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                  >
                    <img
                      ref={imgElementRef}
                      src={rawImageSrc}
                      alt="Crop preview"
                      draggable={false}
                      style={{
                        width: `${displayWidth}px`,
                        height: `${displayHeight}px`,
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                      }}
                    />
                    <div className="sp-crop-ring" />
                  </div>

                  <span className="sp-crop-hint">
                    Geser foto untuk mengatur posisi wajah
                  </span>

                  <div className="sp-zoom-row">
                    <ZoomOut size={16} />
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.02"
                      value={zoom}
                      onChange={(e) => handleZoomChange(e.target.value)}
                    />
                    <ZoomIn size={16} />
                  </div>
                </div>
              ) : (
                <div className="sp-photo-preview">
                  {student?.picture ? (
                    <img src={student.picture} alt="Foto saat ini" />
                  ) : (
                    <span className="sp-photo-initials">{initials}</span>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div className="sp-photo-picker-row">
                <button
                  type="button"
                  className="sp-photo-choose"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                  {rawImageSrc
                    ? 'Ganti File Foto Lain'
                    : 'Pilih Foto dari Perangkat'}
                </button>

                {student?.picture && !rawImageSrc && (
                  <button
                    type="button"
                    className="sp-photo-delete-btn"
                    onClick={handleDeletePhoto}
                    disabled={isUploading}
                    title="Hapus foto profil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {uploadError && <p className="sp-photo-error">{uploadError}</p>}
              {uploadSuccess && (
                <p className="sp-photo-success">
                  <Check size={14} /> Foto berhasil diperbarui!
                </p>
              )}

              <div className="sp-photo-footer">
                <button
                  type="button"
                  className="sp-modal-cancel"
                  onClick={() => setShowPhotoModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="sp-pw-submit"
                  disabled={!rawImageSrc || isUploading}
                  onClick={handleUploadPhoto}
                >
                  {isUploading ? (
                    <>
                      <LoaderCircle size={16} className="sp-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Terapkan & Simpan'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentProfile
