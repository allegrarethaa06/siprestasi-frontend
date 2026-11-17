import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import { api } from '../../api'
import { useAdmin } from '../../data/admin'

import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const adminCtx = useAdmin()
  const user = adminCtx?.user || {
    name: 'Administrator',
    email: '-',
    role: 'admin',
  }
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [isChangingPw, setIsChangingPw] = useState(false)
  const [pwMessage, setPwMessage] = useState(null)
  const [pwError, setPwError] = useState(null)

  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'A'

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError(null)
    setPwMessage(null)

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPwError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.')
      return
    }

    if (passwordData.new_password.length < 8) {
      setPwError('Kata sandi baru minimal 8 karakter.')
      return
    }

    setIsChangingPw(true)
    try {
      const res = await api('profile/password', {
        method: 'PUT',
        body: passwordData,
      })
      setPwMessage(res.message || 'Kata sandi berhasil diperbarui!')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
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
    navigate('/admin/login', { replace: true })
  }

  return (
    <AdminShell>
      {/* PAGE HEADER */}
      <div className="finexy-page-header">
        <div>
          <h1>Profil Saya</h1>
          <p>
            Kelola informasi identitas akun dan keamanan kata sandi Administrator SIPRESTASI.
          </p>
        </div>
      </div>

      {/* KARTU IDENTITAS ADMIN */}
      <section className="adm-profile-banner">
        <div className="adm-profile-left">
          <div className="adm-profile-avatar">{initials}</div>
          <div>
            <h2>{user.name || 'Administrator'}</h2>
            <div className="adm-profile-meta">
              <span>{user.email || '-'}</span>
              <span>•</span>
              <span>Program Studi Sistem Informasi</span>
            </div>
          </div>
        </div>

        <span className="finexy-status-pill approved">
          <ShieldCheck size={14} />
          <span>
            {user.role === 'superadmin'
              ? 'Super Administrator'
              : 'Administrator Aktif'}
          </span>
        </span>
      </section>

      {/* INFORMASI AKUN */}
      <section className="finexy-panel adm-profile-card">
        <div className="adm-profile-card-head">
          <div className="adm-profile-title">
            <div className="adm-profile-icon">
              <User size={17} />
            </div>
            <div>
              <h3>Informasi Akun</h3>
              <p>Identitas akun administrator yang terdaftar pada sistem.</p>
            </div>
          </div>
        </div>

        <div className="adm-profile-grid">
          <div className="adm-profile-field">
            <span>Nama Lengkap</span>
            <strong>{user.name || 'Administrator'}</strong>
          </div>

          <div className="adm-profile-field">
            <span>Alamat Email</span>
            <strong>{user.email || '-'}</strong>
          </div>

          <div className="adm-profile-field">
            <span>Peran Sistem</span>
            <strong>
              {user.role === 'superadmin'
                ? 'Super Administrator'
                : 'Administrator Prodi'}
            </strong>
          </div>

          <div className="adm-profile-field">
            <span>Status Akun</span>
            <strong className="adm-status-active">Aktif</strong>
          </div>
        </div>
      </section>

      {/* UBAH KATA SANDI */}
      <section className="finexy-panel adm-profile-card">
        <div className="adm-profile-card-head">
          <div className="adm-profile-title">
            <div className="adm-profile-icon">
              <KeyRound size={17} />
            </div>
            <div>
              <h3>Ubah Kata Sandi</h3>
              <p>
                Perbarui kata sandi secara berkala untuk menjaga keamanan akun Anda.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="adm-pw-form">
          {pwError && (
            <div className="finexy-alert-banner error">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} />
                <span>{pwError}</span>
              </div>
              <button type="button" onClick={() => setPwError(null)}>
                ✕
              </button>
            </div>
          )}

          {pwMessage && (
            <div className="finexy-alert-banner success">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} />
                <span>{pwMessage}</span>
              </div>
              <button type="button" onClick={() => setPwMessage(null)}>
                ✕
              </button>
            </div>
          )}

          <div className="adm-pw-field">
            <label>Kata Sandi Saat Ini</label>
            <div className="adm-pw-input-wrap">
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
                className="adm-pw-eye"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="adm-pw-row">
            <div className="adm-pw-field">
              <label>Kata Sandi Baru</label>
              <div className="adm-pw-input-wrap">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
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
                  className="adm-pw-eye"
                  onClick={() => setShowNewPw(!showNewPw)}
                >
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <small>
                Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.
              </small>
            </div>

            <div className="adm-pw-field">
              <label>Konfirmasi Kata Sandi Baru</label>
              <div className="adm-pw-input-wrap">
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
                  className="adm-pw-eye"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                >
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="adm-pw-actions">
            <button
              type="submit"
              className="finexy-stage-btn primary"
              disabled={
                isChangingPw ||
                !passwordData.current_password ||
                !passwordData.new_password
              }
            >
              {isChangingPw ? (
                <>
                  <LoaderCircle size={16} className="adm-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Kata Sandi Baru</span>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* KELUAR AKUN */}
      <section className="finexy-panel adm-logout-card">
        <div className="adm-logout-left">
          <div className="adm-profile-icon">
            <LogOut size={17} />
          </div>
          <div>
            <h3>Keluar dari Sesi Akun</h3>
            <p>Akhiri sesi Administrator dan kembali ke halaman masuk.</p>
          </div>
        </div>

        <button
          type="button"
          className="finexy-stage-btn primary"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={15} />
          <span>Keluar Akun</span>
        </button>
      </section>

      {showLogoutConfirm && (
        <div
          className="action-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-modal-icon revision">
              <LogOut size={22} />
            </div>

            <h2>Keluar dari Akun?</h2>
            <p className="action-modal-description">
              Apakah Anda yakin ingin mengakhiri sesi Administrator SIPRESTASI sekarang?
            </p>

            <div className="action-modal-buttons">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="modal-confirm approve"
                onClick={handleLogout}
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

export default Profile
