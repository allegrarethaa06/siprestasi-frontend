import { useContext, useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  FileCheck2,
  Filter,
  HelpCircle,
  LayoutGrid,
  Lock,
  LogOut,
  RotateCcw,
  Search,
  Settings,
  Trophy,
  Unlock,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react'

import StudentUploadModal from '../../components/admin/StudentUploadModal'
import {
  AdminContext,
  closeSelectionPeriod,
  fetchAdminSubmissions,
  fetchCurrentPeriod,
  openSelectionPeriod,
  savePeriodSchedule,
} from '../../data/admin'
import { api } from '../../api'
import logoSiprestasi from '../../assets/branding/logo-siprestasi.png'

import './Admin_dashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
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

  const [showStudentUpload, setShowStudentUpload] = useState(false)
  const [lastUpload, setLastUpload] = useState(null)
  const [serverStats, setServerStats] = useState(null)
  const [serverSubmissions, setServerSubmissions] = useState([])
  const [serverPeriod, setServerPeriod] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [showNotifications, setShowNotifications] = useState(false)

  // Period modal state: null | 'close' | 'open' | 'schedule' | 'result'
  const [periodModal, setPeriodModal] = useState(null)
  const [periodSubmitting, setPeriodSubmitting] = useState(false)
  const [periodFeedback, setPeriodFeedback] = useState(null)
  const [closeResult, setCloseResult] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    tahun_ajaran: '2025/2026',
    tanggal_mulai: '',
    tanggal_selesai: '',
  })

  const loadDashboardData = () => {
    fetchAdminSubmissions()
      .then((res) => {
        if (res?.data) {
          setServerSubmissions(res.data)
          if (res.stats) setServerStats(res.stats)
          if (res.periode) {
            setServerPeriod(res.periode)
            setScheduleForm({
              tahun_ajaran: res.periode.tahun_ajaran || '2025/2026',
              tanggal_mulai: res.periode.tanggal_mulai || '',
              tanggal_selesai: res.periode.tanggal_selesai || '',
            })
          }
        }
      })
      .catch(() => {})

    fetchCurrentPeriod()
      .then((res) => {
        if (res?.data) {
          setServerPeriod(res.data)
          setScheduleForm({
            tahun_ajaran: res.data.tahun_ajaran || '2025/2026',
            tanggal_mulai: res.data.tanggal_mulai || '',
            tanggal_selesai: res.data.tanggal_selesai || '',
          })
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const isPeriodClosed = Boolean(
    serverPeriod?.is_closed === true ||
      serverPeriod?.is_closed === 1 ||
      serverPeriod?.is_closed === '1' ||
      serverPeriod?.is_closed === 't'
  )

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleLogout = async () => {
    try {
      await api('auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    navigate('/admin/login')
  }

  const handleClosePeriod = async () => {
    setPeriodSubmitting(true)
    setPeriodFeedback(null)
    try {
      const res = await closeSelectionPeriod()
      const updated = res?.data?.periode || { ...serverPeriod, is_closed: true }
      setServerPeriod(updated)
      setCloseResult({
        message:
          res?.message ||
          'Periode Tahap 1 resmi ditutup & Pradita Value (Tahap 2) telah dibuka.',
        finalists: res?.data?.finalists || [],
        emailsSent: res?.data?.emails_sent ?? 0,
      })
      setPeriodModal('result')
      loadDashboardData()
    } catch (err) {
      setPeriodFeedback({
        type: 'error',
        text: err?.message || 'Gagal menutup periode Tahap 1.',
      })
      setPeriodModal(null)
    } finally {
      setPeriodSubmitting(false)
    }
  }

  const handleOpenPeriod = async () => {
    setPeriodSubmitting(true)
    setPeriodFeedback(null)
    try {
      const res = await openSelectionPeriod()
      const updated = res?.data || { ...serverPeriod, is_closed: false }
      setServerPeriod(updated)
      setPeriodFeedback({
        type: 'success',
        text: 'Periode Tahap 1 berhasil dibuka kembali & Pradita Value dikunci.',
      })
      setPeriodModal(null)
      loadDashboardData()
    } catch (err) {
      setPeriodFeedback({
        type: 'error',
        text: err?.message || 'Gagal membuka periode Tahap 1.',
      })
      setPeriodModal(null)
    } finally {
      setPeriodSubmitting(false)
    }
  }

  const handleSaveSchedule = async (e) => {
    e.preventDefault()
    setPeriodSubmitting(true)
    setPeriodFeedback(null)
    try {
      const res = await savePeriodSchedule(scheduleForm)
      const updated = res?.data || { ...serverPeriod, ...scheduleForm }
      setServerPeriod(updated)
      setPeriodFeedback({
        type: 'success',
        text: 'Jadwal periode seleksi berhasil diperbarui.',
      })
      setPeriodModal(null)
      loadDashboardData()
    } catch (err) {
      setPeriodFeedback({
        type: 'error',
        text: err?.message || 'Gagal menyimpan jadwal periode.',
      })
    } finally {
      setPeriodSubmitting(false)
    }
  }

  const totalCount = serverStats?.total ?? 0
  const reviewCount = serverStats?.perlu_ditinjau ?? 0
  const revisionCount = serverStats?.perlu_revisi ?? 0
  const approvedCount = serverStats?.disetujui ?? 0

  const statCards = [
    {
      title: 'Total Pengajuan',
      value: totalCount,
      badge: `TA ${serverPeriod?.tahun_ajaran || '2025/2026'}`,
      badgeType: 'neutral',
      footer: 'Mahasiswa terdaftar seleksi',
      filterStatus: 'Semua',
      Icon: Users,
    },
    {
      title: 'Perlu Ditinjau',
      value: reviewCount,
      badge: reviewCount > 0 ? 'Butuh Verifikasi' : 'Selesai',
      badgeType: reviewCount > 0 ? 'amber' : 'green',
      footer: 'Menunggu pemeriksaan berkas',
      filterStatus: 'Perlu Ditinjau',
      Icon: ClipboardCheck,
    },
    {
      title: 'Perlu Revisi',
      value: revisionCount,
      badge: revisionCount > 0 ? 'Perbaikan' : '0 Revisi',
      badgeType: revisionCount > 0 ? 'rose' : 'neutral',
      footer: 'Menunggu perbaikan dokumen',
      filterStatus: 'Perlu Revisi',
      Icon: RotateCcw,
    },
    {
      title: 'Disetujui Tahap 1',
      value: approvedCount,
      badge: totalCount > 0 ? `${Math.round((approvedCount / totalCount) * 100)}% Lolos` : 'Terverifikasi',
      badgeType: 'green',
      footer: 'Berkas Tahap 1 valid & dinilai',
      filterStatus: 'Disetujui',
      Icon: CheckCircle2,
    },
  ]

  const stages = [
    {
      step: 'Tahap 01',
      title: 'Verifikasi Berkas',
      desc: 'Pemeriksaan prestasi, organisasi & bahasa',
      status: isPeriodClosed ? 'Selesai' : 'Sedang Berjalan',
      state: isPeriodClosed ? 'done' : 'active',
      progress: totalCount > 0 ? Math.min(100, Math.round((approvedCount / totalCount) * 100)) : isPeriodClosed ? 100 : 35,
    },
    {
      step: 'Tahap 02',
      title: 'Ranking Angkatan',
      desc: 'Penetapan Top 3 per angkatan',
      status: isPeriodClosed ? 'Top 3 Ditetapkan' : 'Menunggu Penutupan',
      state: isPeriodClosed ? 'done' : 'waiting',
      progress: isPeriodClosed ? 100 : 0,
    },
    {
      step: 'Tahap 03',
      title: 'Pradita Value',
      desc: 'Penilaian 3 rekan sejawat & 2 dosen',
      status: isPeriodClosed ? 'Sedang Dibuka' : 'Terkunci',
      state: isPeriodClosed ? 'active' : 'locked',
      progress: isPeriodClosed ? 50 : 0,
    },
    {
      step: 'Tahap 04',
      title: 'Hasil Akhir',
      desc: 'Penetapan Mahasiswa Berprestasi',
      status: 'Belum Dimulai',
      state: 'waiting',
      progress: 0,
    },
  ]

  const quickTasks = [
    {
      id: 'verify',
      title: `${reviewCount} Berkas Menunggu Verifikasi`,
      desc: 'Periksa keaslian sertifikat dan setujui pengajuan Tahap 1',
      btnLabel: 'Verifikasi',
      primary: reviewCount > 0,
      Icon: FileCheck2,
      onClick: () =>
        navigate('/admin/daftar-mapres', {
          state: { statusFilter: 'Perlu Ditinjau' },
        }),
    },
    {
      id: 'revision',
      title: `${revisionCount} Pengajuan dalam Status Revisi`,
      desc: 'Pantau dokumen mahasiswa yang diminta untuk diperbaiki',
      btnLabel: 'Tinjau',
      primary: false,
      Icon: RotateCcw,
      onClick: () =>
        navigate('/admin/daftar-mapres', {
          state: { statusFilter: 'Perlu Revisi' },
        }),
    },
    {
      id: 'pv',
      title: isPeriodClosed
        ? 'Kelola Penilai Pradita Value (Tahap 2)'
        : 'Pradita Value Terkunci Selama Tahap 1',
      desc: isPeriodClosed
        ? 'Tetapkan Kaprodi & Dosen Penilai untuk Finalis Top 3'
        : 'Tutup periode Tahap 1 untuk menetapkan Top 3 & mengirim email kelulusan',
      btnLabel: isPeriodClosed ? 'Buka PV' : 'Tutup Tahap 1',
      primary: false,
      Icon: isPeriodClosed ? UserCheck : Lock,
      onClick: () => {
        if (isPeriodClosed) {
          navigate('/admin/pradita-value')
        } else {
          setPeriodModal('close')
        }
      },
    },
  ]

  const filteredSubmissions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return serverSubmissions
      .filter((item) => {
        const matchQuery =
          !q ||
          item.name?.toLowerCase().includes(q) ||
          item.nim?.toLowerCase().includes(q) ||
          String(item.angkatan || '').includes(q)
        const matchStatus =
          statusFilter === 'Semua' ||
          item.status?.toLowerCase() === statusFilter.toLowerCase()
        return matchQuery && matchStatus
      })
      .slice(0, 8)
  }, [serverSubmissions, searchQuery, statusFilter])

  return (
    <div className="finexy-admin-shell">
      {/* =========================
          TOPBAR PUTIH BERSIH
      ========================= */}
      <header className="finexy-topbar">
        <div className="finexy-topbar-brand" onClick={() => navigate('/admin/dashboard')}>
          <img src={logoSiprestasi} alt="SIPRESTASI" className="finexy-brand-logo" />
          <div className="finexy-brand-divider" />
          <span className="finexy-brand-tag">Admin Prodi</span>
        </div>

        <div className="finexy-topbar-search">
          <Search size={16} className="finexy-search-icon" />
          <input
            type="text"
            placeholder="Cari nama mahasiswa atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={() => setPeriodModal('schedule')}
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

      {/* =========================
          BODY: SIDEBAR + MAIN
      ========================= */}
      <div className="finexy-body-grid">
        {/* SIDEBAR KIRI */}
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
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
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
              className={({ isActive }) =>
                `finexy-nav-item ${isActive ? 'active' : ''}`
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
              onClick={() => setPeriodModal('schedule')}
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

        {/* AREA KONTEN UTAMA */}
        <main className="finexy-main">
          {/* BARIS JUDUL & PILL PERIODE */}
          <div className="finexy-page-header">
            <div>
              <h1>Ringkasan Seleksi</h1>
              <p>
                Pantau verifikasi berkas Tahap 1, periode seleksi, dan tahap Pradita Value.
              </p>
            </div>

            <div className="finexy-header-controls">
              <button
                type="button"
                className="finexy-date-pill"
                onClick={() => setPeriodModal('schedule')}
              >
                <Calendar size={15} />
                <span>
                  { formatShortDate(serverPeriod?.tanggal_mulai) } –{' '}
                  { formatShortDate(serverPeriod?.tanggal_selesai) }
                </span>
                <ChevronDown size={14} />
              </button>

              {isPeriodClosed ? (
                <button
                  type="button"
                  className="finexy-stage-btn reopen"
                  onClick={() => setPeriodModal('open')}
                >
                  <Unlock size={15} />
                  <span>Buka Kembali Tahap 1</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="finexy-stage-btn primary"
                  onClick={() => setPeriodModal('close')}
                >
                  <CheckCircle2 size={15} />
                  <span>Tutup Tahap 1 &amp; Buka Pradita Value</span>
                </button>
              )}
            </div>
          </div>

          {periodFeedback && (
            <div className={`finexy-alert-banner ${periodFeedback.type}`}>
              <span>{periodFeedback.text}</span>
              <button type="button" onClick={() => setPeriodFeedback(null)}>
                ✕
              </button>
            </div>
          )}

          {/* BARIS 1: 4 KARTU STATISTIK */}
          <section className="finexy-stats-row">
            {statCards.map((card) => {
              const IconComp = card.Icon
              return (
                <article
                  key={card.title}
                  className="finexy-stat-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate('/admin/daftar-mapres', {
                      state: { statusFilter: card.filterStatus },
                    })
                  }
                >
                  <div className="finexy-stat-top">
                    <span>{card.title}</span>
                    <div className="finexy-stat-icon">
                      <IconComp size={18} />
                    </div>
                  </div>

                  <div className="finexy-stat-middle">
                    <strong>{card.value}</strong>
                    <span className={`finexy-stat-badge ${card.badgeType}`}>
                      {card.badge}
                    </span>
                  </div>

                  <p className="finexy-stat-foot">{card.footer}</p>
                </article>
              )
            })}
          </section>

          {/* BARIS 2: 2 KOLOM BERSEBELAHAN (ALUR SELEKSI + PERLU TINDAKAN) */}
          <section className="finexy-middle-grid">
            {/* KIRI: ALUR & KONTROL PERIODE SELEKSI */}
            <div className="finexy-panel">
              <div className="finexy-panel-head">
                <div>
                  <h2>Alur &amp; Status Periode Seleksi</h2>
                  <p>
                    {approvedCount} dari {totalCount} pengajuan mahasiswa telah disetujui pada Tahap 1
                  </p>
                </div>

                <span className={`finexy-period-chip ${isPeriodClosed ? 'closed' : 'open'}`}>
                  <span className="finexy-chip-dot" />
                  {isPeriodClosed ? 'Tahap 2 (Pradita Value) Dibuka' : 'Tahap 1 Sedang Dibuka'}
                </span>
              </div>

              <div className="finexy-stages-grid">
                {stages.map((st) => (
                  <div key={st.step} className={`finexy-stage-box ${st.state}`}>
                    <div className="finexy-stage-box-top">
                      <span className="finexy-stage-step">{st.step}</span>
                      <span className={`finexy-stage-pill ${st.state}`}>
                        {st.status}
                      </span>
                    </div>

                    <strong>{st.title}</strong>
                    <p>{st.desc}</p>

                    <div className="finexy-stage-bar">
                      <div
                        className="finexy-stage-bar-fill"
                        style={{ width: `${st.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="finexy-period-footer">
                <div className="finexy-period-footer-copy">
                  {isPeriodClosed ? (
                    <>
                      <Unlock size={16} className="finexy-footer-icon" />
                      <span>
                        <strong>Pradita Value Sedang Terbuka:</strong> Finalis Top 3 per angkatan telah ditetapkan dan email kelulusan telah dikirim.
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="finexy-footer-icon" />
                      <span>
                        <strong>Pradita Value Masih Terkunci:</strong> Menyetujui berkas mahasiswa saat ini hanya memverifikasi Tahap 1 hingga periode ditutup.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* KANAN: PERLU TINDAKAN */}
            <div className="finexy-panel">
              <div className="finexy-panel-head">
                <div>
                  <h2>Perlu Tindakan</h2>
                  <p>Tugas prioritas verifikasi dan pengelolaan tahap seleksi</p>
                </div>
              </div>

              <div className="finexy-tasks-stack">
                {quickTasks.map((task) => {
                  const TaskIcon = task.Icon
                  return (
                    <div key={task.id} className="finexy-task-row">
                      <div className="finexy-task-icon">
                        <TaskIcon size={18} />
                      </div>
                      <div className="finexy-task-copy">
                        <strong>{task.title}</strong>
                        <span>{task.desc}</span>
                      </div>
                      <button
                        type="button"
                        className="finexy-task-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          task.onClick?.()
                        }}
                      >
                        {task.btnLabel}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* BARIS 3: TABEL PENGAJUAN TERBARU */}
          <section className="finexy-panel finexy-table-panel">
            <div className="finexy-table-head">
              <div>
                <h2>Pengajuan Mahasiswa Terbaru</h2>
                <p>Daftar pengajuan seleksi Tahap 1 yang masuk ke dalam sistem</p>
              </div>

              <div className="finexy-table-tools">
                <div className="finexy-mini-search">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Cari nama / NIM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="finexy-filter-select">
                  <Filter size={14} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Perlu Ditinjau">Perlu Ditinjau</option>
                    <option value="Perlu Revisi">Perlu Revisi</option>
                    <option value="Disetujui">Disetujui</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="finexy-view-all-btn"
                  onClick={() => navigate('/admin/daftar-mapres')}
                >
                  Semua Pengajuan →
                </button>
              </div>
            </div>

            <div className="finexy-table-wrap">
              <table className="finexy-table">
                <thead>
                  <tr>
                    <th>NIM</th>
                    <th>Tanggal Kirim</th>
                    <th>Nama Mahasiswa</th>
                    <th>Angkatan</th>
                    <th>Kelengkapan</th>
                    <th>Status</th>
                    <th>Skor Tahap 1</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="finexy-table-empty">
                        Belum ada data pengajuan yang sesuai dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((item) => {
                      const statusClass =
                        item.status === 'Disetujui'
                          ? 'approved'
                          : item.status === 'Perlu Revisi'
                            ? 'revision'
                            : 'review'

                      const actionLabel =
                        item.status === 'Disetujui'
                          ? 'Lihat Detail'
                          : item.status === 'Perlu Revisi'
                            ? 'Tinjau Revisi'
                            : 'Verifikasi'

                      return (
                        <tr key={item.sub_id || item.nim}>
                          <td className="finexy-td-nim">{item.nim}</td>
                          <td className="finexy-td-date">
                            <Clock size={13} />
                            <span>{item.tanggal || '-'}</span>
                          </td>
                          <td>
                            <div className="finexy-student-cell">
                              <div className="finexy-student-avatar">
                                {item.initials || 'M'}
                              </div>
                              <div>
                                <strong>{item.name}</strong>
                                <span>Sistem Informasi</span>
                              </div>
                            </div>
                          </td>
                          <td>{item.angkatan}</td>
                          <td>
                            <span className="finexy-completeness-text">
                              {item.kelengkapan || '-'}
                            </span>
                          </td>
                          <td>
                            <span className={`finexy-status-pill ${statusClass}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="finexy-td-score">
                            {item.total_score != null
                              ? `${Number(item.total_score).toFixed(2)}`
                              : '0.00'}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`finexy-row-btn ${
                                actionLabel === 'Verifikasi' ? 'primary' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (actionLabel === 'Verifikasi') {
                                  navigate(`/admin/daftar-mapres/${item.nim}/verifikasi`)
                                } else if (actionLabel === 'Tinjau Revisi') {
                                  navigate(`/admin/daftar-mapres/${item.nim}/revisi`)
                                } else {
                                  navigate(`/admin/daftar-mapres/${item.nim}/detail`)
                                }
                              }}
                            >
                              {actionLabel}
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {lastUpload && (
            <section className="finexy-upload-toast">
              <div>
                <strong>Upload Data Mahasiswa Selesai</strong>
                <span>
                  {lastUpload.fileName} • {lastUpload.uploadedAt} ({lastUpload.success}{' '}
                  berhasil dari {lastUpload.total} baris)
                </span>
              </div>
              <button type="button" onClick={() => setLastUpload(null)}>
                ✕
              </button>
            </section>
          )}
        </main>
      </div>

      {/* =========================
          MODAL KONFIRMASI TUTUP TAHAP 1
      ========================= */}
      {periodModal === 'close' && (
        <div
          className="finexy-modal-backdrop"
          onClick={() => !periodSubmitting && setPeriodModal(null)}
        >
          <div className="finexy-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="finexy-modal-icon burgundy">
              <CheckCircle2 size={22} />
            </div>
            <h3>Tutup Periode Tahap 1 &amp; Buka Pradita Value?</h3>
            <p>
              Sistem akan mengunci pendaftaran Tahap 1, menetapkan{' '}
              <strong>Top 3 Mahasiswa per Angkatan</strong> dari berkas yang telah disetujui, serta membuka tahap{' '}
              <strong>Pradita Value</strong>.
            </p>
            <div className="finexy-modal-note">
              <strong>Notifikasi Email Otomatis:</strong> Setiap mahasiswa yang masuk Top 3 akan menerima email pemberitahuan kelulusan Tahap 1 untuk segera mengisi 3 Rekan Sejawat.
            </div>
            <div className="finexy-modal-actions">
              <button
                type="button"
                className="finexy-btn-ghost"
                disabled={periodSubmitting}
                onClick={() => setPeriodModal(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="finexy-btn-solid"
                disabled={periodSubmitting}
                onClick={handleClosePeriod}
              >
                {periodSubmitting
                  ? 'Memproses & Mengirim Email...'
                  : 'Ya, Tutup Tahap 1 & Buka Pradita Value'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MODAL BUKA KEMBALI TAHAP 1
      ========================= */}
      {periodModal === 'open' && (
        <div
          className="finexy-modal-backdrop"
          onClick={() => !periodSubmitting && setPeriodModal(null)}
        >
          <div className="finexy-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="finexy-modal-icon amber">
              <Unlock size={22} />
            </div>
            <h3>Buka Kembali Periode Tahap 1?</h3>
            <p>
              Membuka kembali periode Tahap 1 akan mengizinkan verifikasi berkas dilanjutkan dan{' '}
              <strong>mengunci kembali halaman Pradita Value</strong> pada sisi mahasiswa hingga periode ditutup kembali.
            </p>
            <div className="finexy-modal-actions">
              <button
                type="button"
                className="finexy-btn-ghost"
                disabled={periodSubmitting}
                onClick={() => setPeriodModal(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="finexy-btn-solid"
                disabled={periodSubmitting}
                onClick={handleOpenPeriod}
              >
                {periodSubmitting ? 'Memproses...' : 'Ya, Buka Tahap 1'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MODAL ATUR JADWAL PERIODE
      ========================= */}
      {periodModal === 'schedule' && (
        <div
          className="finexy-modal-backdrop"
          onClick={() => !periodSubmitting && setPeriodModal(null)}
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
                    setScheduleForm((prev) => ({ ...prev, tahun_ajaran: e.target.value }))
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
                      setScheduleForm((prev) => ({ ...prev, tanggal_mulai: e.target.value }))
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
                  disabled={periodSubmitting}
                  onClick={() => setPeriodModal(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="finexy-btn-solid"
                  disabled={periodSubmitting}
                >
                  {periodSubmitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          MODAL HASIL PENETAPAN TOP 3
      ========================= */}
      {periodModal === 'result' && closeResult && (
        <div className="finexy-modal-backdrop" onClick={() => setPeriodModal(null)}>
          <div className="finexy-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="finexy-modal-icon green">
              <CheckCircle2 size={22} />
            </div>
            <h3>Tahap 2 (Pradita Value) Resmi Dibuka!</h3>
            <p>{closeResult.message}</p>

            {closeResult.finalists && closeResult.finalists.length > 0 ? (
              <div className="finexy-finalists-box">
                <div className="finexy-finalists-head">
                  <span>Finalis Top 3 yang Lolos Tahap 1</span>
                  <strong>{closeResult.emailsSent} Email Terkirim</strong>
                </div>
                <div className="finexy-finalists-list">
                  {closeResult.finalists.map((f) => (
                    <div key={f.sub_id} className="finexy-finalist-item">
                      <div>
                        <strong>
                          #{f.rank} {f.name}
                        </strong>
                        <span>
                          NIM {f.nim} • Angkatan {f.year} • {f.email}
                        </span>
                      </div>
                      <div className="finexy-finalist-right">
                        <strong>{Number(f.total_score).toFixed(2)} Poin</strong>
                        <span className="finexy-email-sent-badge">
                          {f.email_sent ? '✓ Email Terkirim' : 'Tersimpan'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="finexy-modal-note">
                Belum ada pengajuan mahasiswa berstatus Disetujui yang dapat dimasukkan ke dalam Top 3.
              </div>
            )}

            <div className="finexy-modal-actions">
              <button
                type="button"
                className="finexy-btn-solid"
                onClick={() => setPeriodModal(null)}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MODAL UPLOAD DATA MAHASISWA
      ========================= */}
      <StudentUploadModal
        isOpen={showStudentUpload}
        onClose={() => setShowStudentUpload(false)}
        onUploadComplete={(result) => {
          setLastUpload({
            ...result,
            uploadedAt: new Date().toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          })
        }}
      />
    </div>
  )
}

export default AdminDashboard
