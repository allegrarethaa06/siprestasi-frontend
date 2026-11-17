import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Camera, Check, X, LoaderCircle } from 'lucide-react'
import { api } from '../../api'
import logoSiprestasi from '../../assets/branding/logo-siprestasi.png'
import './StudentTopbar.css'

export default function StudentTopbar({ student }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const menuRef = useRef(null)
  const fileInputRef = useRef(null)

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api('auth/logout', { method: 'POST' })
    } catch (_) {}
    navigate('/login', { replace: true })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadError('Gunakan format foto JPG atau PNG.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran foto maksimal 2 MB.')
      return
    }
    setSelectedFile(file)
    setUploadError(null)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleUploadPhoto = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('picture', selectedFile)

    try {
      await api('profile/picture', { method: 'POST', body: formData })
      setUploadSuccess(true)
      setTimeout(() => {
        window.location.reload()
      }, 800)
    } catch (err) {
      setUploadError(err.message || 'Gagal mengunggah foto.')
    } finally {
      setIsUploading(false)
    }
  }

  const initials = student?.name
    ? student.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'M'

  return (
    <>
      <header className="student-topbar">
        <div className="student-topbar-container">
          {/* Logo & Brand */}
          <div className="student-topbar-brand" onClick={() => navigate('/dashboard')}>
            <img src={logoSiprestasi} alt="SIPRESTASI" className="student-topbar-logo" />
          </div>

          {/* User Profile & Menu */}
          <div className="student-topbar-user" ref={menuRef}>
            <button
              type="button"
              className="student-user-btn"
              onClick={() => setShowMenu(prev => !prev)}
              aria-expanded={showMenu}
            >
              <div className="student-user-avatar">
                {student?.picture ? (
                  <img src={student.picture} alt={student?.name || 'User'} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="student-user-info">
                <strong className="student-user-name">{student?.name || 'Mahasiswa'}</strong>
                <span className="student-user-nim">{student?.nim || 'S1 Sistem Informasi'}</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="student-dropdown-menu">
                <div className="student-dropdown-header">
                  <strong>{student?.name}</strong>
                  <span>{student?.email || student?.nim}</span>
                </div>
                <button
                  type="button"
                  className="student-dropdown-item"
                  onClick={() => {
                    setShowMenu(false)
                    navigate('/dashboard/profile')
                  }}
                >
                  <User size={16} />
                  <span>Profil Saya</span>
                </button>
                <button
                  type="button"
                  className="student-dropdown-item"
                  onClick={() => {
                    setShowMenu(false)
                    setShowPhotoModal(true)
                  }}
                >
                  <Camera size={16} />
                  <span>Upload Foto Profil</span>
                </button>
                <div className="student-dropdown-divider" />
                <button
                  type="button"
                  className="student-dropdown-item student-dropdown-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Upload Foto Profil */}
      {showPhotoModal && (
        <div className="photo-modal-overlay">
          <div className="photo-modal-card">
            <div className="photo-modal-header">
              <h3>Foto Profil Mahasiswa</h3>
              <button
                type="button"
                className="photo-modal-close"
                onClick={() => {
                  setShowPhotoModal(false)
                  setPreviewUrl(null)
                  setSelectedFile(null)
                  setUploadError(null)
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="photo-modal-body">
              <p className="photo-modal-desc">
                Unggah pas foto formal / foto wajah Anda. Foto ini akan ditampilkan pada profil dan <strong>podium pemenang (Top 3)</strong>.
              </p>

              <div className="photo-preview-circle">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" />
                ) : student?.picture ? (
                  <img src={student.picture} alt="Current" />
                ) : (
                  <span className="photo-placeholder-initials">{initials}</span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <button
                type="button"
                className="photo-choose-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
                Pilih Foto dari Galeri / File
              </button>

              {uploadError && <p className="photo-error-msg">{uploadError}</p>}
              {uploadSuccess && (
                <p className="photo-success-msg">
                  <Check size={16} /> Foto berhasil diperbarui!
                </p>
              )}
            </div>

            <div className="photo-modal-footer">
              <button
                type="button"
                className="photo-cancel-btn"
                onClick={() => {
                  setShowPhotoModal(false)
                  setPreviewUrl(null)
                  setSelectedFile(null)
                }}
              >
                Batal
              </button>
              <button
                type="button"
                className="photo-save-btn"
                disabled={!selectedFile || isUploading}
                onClick={handleUploadPhoto}
              >
                {isUploading ? (
                  <>
                    <LoaderCircle size={16} className="spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Foto'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
