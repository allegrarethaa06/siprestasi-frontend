import { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  FileCheck2,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Search,
  Settings,
  Trophy,
  Upload,
  Users,
} from 'lucide-react'

import StudentUploadModal from './StudentUploadModal'
import {
  AdminContext,
  fetchAdminSubmissions,
  fetchCurrentPeriod,
  savePeriodSchedule,
} from '../../data/admin'
import { api } from '../../api'
import logoSiprestasi from '../../assets/branding/logo-siprestasi.png'

import '../../pages/admin/Admin_dashboard.css'

export default function AdminShell({
  children,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari nama mahasiswa atau NIM...',
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const adminCtx = useContext(AdminContext)
  const user = adminCtx?.user
  const displayName = user?.name || user?.nama || user?.username || 'Administrator'
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'A'

  const [internalSearch, setInternalSearch] = useState('')
  const [reviewCount, setReviewCount] = useState(0)
  const [serverPeriod, setServerPeriod] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showStudentUpload, setShowStudentUpload] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    tahun_ajaran: '2025/2026',
    tanggal_mulai: '',
    tanggal_selesai: '',
  })

  useEffect(() => {
    let cancelled = false
    fetchAdminSubmissions()
      .then((res) => {
        if (!cancelled && res?.stats) {
          setReviewCount(res.stats.perlu_ditinjau ?? 0)
        }
        if (!cancelled && res?.periode) {
          setServerPeriod(res.periode)
          setScheduleForm({
            tahun_ajaran: res.periode.tahun_ajaran || '2025/2026',
            tanggal_mulai: res.periode.tanggal_mulai || '',
            tanggal_selesai: res.periode.tanggal_selesai || '',
          })
        }
      })
      .catch(() => {})

    fetchCurrentPeriod()
      .then((res) => {
        if (!cancelled && res?.data) {
          setServerPeriod(res.data)
          setScheduleForm({
            tahun_ajaran: res.data.tahun_ajaran || '2025/2026',
            tanggal_mulai: res.data.tanggal_mulai || '',
            tanggal_selesai: res.data.tanggal_selesai || '',
          })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [location.pathname])

  const isPeriodClosed = Boolean(
    serverPeriod?.is_closed === true ||
      serverPeriod?.is_closed === 1 ||
      serverPeriod?.is_closed === '1' ||
      serverPeriod?.is_closed === 't'
  )

  const isVerifikasiSection =
    location.pathname.startsWith('/admin/daftar-mapres') &&
    !location.pathname.includes('/ranking')

  const isRankingSection =
    location.pathname.includes('/admin/peringkat-tahap-1') ||
    location.pathname.includes('/admin/daftar-mapres/ranking')

  const handleLogout = async () => {
    try {
      await api('auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    navigate('/admin/login')
  }

  const handleSaveSchedule = async (e) => {
    e.preventDefault()
    setScheduleSubmitting(true)
    try {
      const res = await savePeriodSchedule(scheduleForm)
      if (res?.data) setServerPeriod(res.data)
      setShowScheduleModal(false)
    } catch {
      // ignore
    } finally {
      setScheduleSubmitting(false)
    }
  }

  const activeSearch = searchValue !== undefined ? searchValue : internalSearch
  const handleSearchInput = (val) => {
    if (onSearchChange) {
      onSearchChange(val)
    } else {
      setInternalSearch(val)
    }
  }

  return (
    <div className="finexy-admin-shell">
      {/* TOPBAR */}
      <header className="finexy-topbar">
        <div
          className="finexy-topbar-brand"
          onClick={() => navigate('/admin/dashboard')}
        >
          <img
            src={logoSiprestasi}
            alt="SIPRESTASI"
            className="finexy-brand-logo"
          />
          <div className="finexy-brand-divider" />
          <span className="finexy-brand-tag">Admin Prodi</span>
        </div>

        <div className="finexy-topbar-search">
          <Search size={16} className="finexy-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={activeSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !onSearchChange && activeSearch.trim()) {
                navigate('/admin/daftar-mapres')
              }
            }}
          />
          <span className="finexy-search-kbd">⌘ K</span>
        </div>

        <div className="finexy-topbar-right">
          <div className="finexy-notif-wrap">
            <button
              type="button"
              className="finexy-icon-circle"
              aria-label="Notifikasi"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <Bell size={17} />
              {reviewCount > 0 && <span className="finexy-notif-dot" />}
            </button>

            {showNotifications && (
              <div className="finexy-notif-popover">
                <div className="finexy-notif-head">
                  <strong>Notifikasi Sistem</strong>
                  <span>{reviewCount} perlu ditinjau</span>
                </div>
                {reviewCount > 0 ? (
                  <button
                    type="button"
                    className="finexy-notif-item"
                    onClick={() => {
                      setShowNotifications(false)
                      navigate('/admin/daftar-mapres')
                    }}
                  >
                    <span className="finexy-notif-bullet" />
                    <div>
                      <strong>{reviewCount} Pengajuan Menunggu Verifikasi</strong>
                      <p>Klik untuk memeriksa berkas Tahap 1 mahasiswa.</p>
                    </div>
                  </button>
                ) : (
                  <p className="finexy-notif-empty">Belum ada notifikasi baru.</p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="finexy-icon-circle"
            title="Atur Jadwal Periode"
            onClick={() => setShowScheduleModal(true)}
          >
            <HelpCircle size={17} />
          </button>

          <button
            type="button"
            className="finexy-profile-pill"
            onClick={() => navigate('/admin/profile')}
          >
            <div className="finexy-profile-avatar">{initials}</div>
            <div className="finexy-profile-info">
              <strong>{displayName}</strong>
              <span>Administrator</span>
            </div>
            <ChevronDown size={15} className="finexy-profile-chevron" />
          </button>
        </div>
      </header>

      {/* BODY GRID */}
      <div className="finexy-body-grid">
        <aside className="finexy-sidebar">
          <div className="finexy-sidebar-group">
            <span className="finexy-sidebar-label">Menu Utama</span>

            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <LayoutGrid size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/daftar-mapres"
              end
              className={() =>
                `finexy-nav-item ${isVerifikasiSection ? 'active' : ''}`
              }
            >
              <FileCheck2 size={18} />
              <span>Verifikasi Tahap 1</span>
              {reviewCount > 0 && (
                <em className="finexy-nav-badge">{reviewCount}</em>
              )}
            </NavLink>

            <NavLink
              to="/admin/peringkat-tahap-1"
              className={() =>
                `finexy-nav-item ${isRankingSection ? 'active' : ''}`
              }
            >
              <BarChart3 size={18} />
              <span>Peringkat Tahap 1</span>
            </NavLink>

            <NavLink
              to="/admin/pradita-value"
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Users size={18} />
              <span>Pradita Value</span>
              <em className={`finexy-nav-tag ${isPeriodClosed ? 'open' : 'locked'}`}>
                {isPeriodClosed ? 'Aktif' : 'Terkunci'}
              </em>
            </NavLink>

            <NavLink
              to="/admin/hasil-seleksi"
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Trophy size={18} />
              <span>Hasil Akhir</span>
            </NavLink>
          </div>

          <div className="finexy-sidebar-group">
            <span className="finexy-sidebar-label">Kelola Data</span>

            <button
              type="button"
              className="finexy-nav-item finexy-nav-button"
              onClick={() => setShowStudentUpload(true)}
            >
              <Upload size={18} />
              <span>Upload Master IPK &amp; SKPI</span>
            </button>

            <button
              type="button"
              className="finexy-nav-item finexy-nav-button"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar size={18} />
              <span>Jadwal Periode</span>
            </button>
          </div>

          <div className="finexy-sidebar-group finexy-sidebar-bottom">
            <span className="finexy-sidebar-label">Umum</span>

            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Settings size={18} />
              <span>Profil Saya</span>
            </NavLink>

            <button
              type="button"
              className="finexy-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              <span>Keluar Akun</span>
            </button>
          </div>
        </aside>

        <main className="finexy-main">{children}</main>
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div
          className="finexy-modal-backdrop"
          onClick={() => !scheduleSubmitting && setShowScheduleModal(false)}
        >
          <div className="finexy-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="finexy-modal-icon burgundy">
              <Calendar size={22} />
            </div>
            <h3>Atur Jadwal Periode Seleksi</h3>
            <p>Tentukan tahun ajaran serta rentang tanggal pelaksanaan seleksi Tahap 1.</p>

            <form onSubmit={handleSaveSchedule} className="finexy-schedule-form">
              <label>
                <span>Tahun Ajaran</span>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2025/2026"
                  value={scheduleForm.tahun_ajaran}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      tahun_ajaran: e.target.value,
                    }))
                  }
                />
              </label>

              <div className="finexy-schedule-row">
                <label>
                  <span>Tanggal Mulai</span>
                  <input
                    type="date"
                    required
                    value={scheduleForm.tanggal_mulai}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        tanggal_mulai: e.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span>Tanggal Selesai</span>
                  <input
                    type="date"
                    required
                    value={scheduleForm.tanggal_selesai}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        tanggal_selesai: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="finexy-modal-actions">
                <button
                  type="button"
                  className="finexy-btn-ghost"
                  disabled={scheduleSubmitting}
                  onClick={() => setShowScheduleModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="finexy-btn-solid"
                  disabled={scheduleSubmitting}
                >
                  {scheduleSubmitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <StudentUploadModal
        isOpen={showStudentUpload}
        onClose={() => setShowStudentUpload(false)}
        onUploadComplete={() => {}}
      />
    </div>
  )
}
