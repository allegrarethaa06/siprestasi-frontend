import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  Info,
  Lock,
  Send,
  Trophy,
  Unlock,
  Users,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import {
  closeSelectionPeriod,
  fetchAdminFinalists,
  openSelectionPeriod,
} from '../../data/admin'

import './PraditaValue.css'

function PraditaValue() {
  const navigate = useNavigate()

  const [selectedYear, setSelectedYear] = useState('2024')
  const [serverFinalists, setServerFinalists] = useState([])
  const [serverPeriod, setServerPeriod] = useState(null)
  const [periodBusy, setPeriodBusy] = useState(false)
  const [periodFeedback, setPeriodFeedback] = useState('')

  const loadFinalists = () => {
    fetchAdminFinalists()
      .then((res) => {
        if (res?.data) {
          setServerFinalists(res.data)
        }
        if (res?.periode) {
          setServerPeriod(res.periode)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadFinalists()
  }, [])

  const isClosed = Boolean(Number(serverPeriod?.is_closed ?? 0))

  const handleTogglePeriod = async () => {
    if (periodBusy) return
    setPeriodBusy(true)
    setPeriodFeedback('')
    try {
      if (isClosed) {
        const res = await openSelectionPeriod()
        setServerPeriod(
          res?.data || { ...(serverPeriod || {}), is_closed: false }
        )
        setPeriodFeedback(
          'Periode Tahap 1 dibuka kembali. Tahap Pradita Value dikunci sementara.'
        )
      } else {
        const res = await closeSelectionPeriod()
        setServerPeriod(
          res?.data || { ...(serverPeriod || {}), is_closed: true }
        )
        setPeriodFeedback(
          'Periode Tahap 1 ditutup! Finalis Top 3 tiap angkatan kini aktif di Pradita Value.'
        )
      }
      loadFinalists()
    } catch (err) {
      setPeriodFeedback(err?.message || 'Gagal memperbarui status periode.')
    } finally {
      setPeriodBusy(false)
    }
  }

  const currentFinalists = serverFinalists

  const filteredFinalists = useMemo(() => {
    if (selectedYear === 'all') return currentFinalists
    return currentFinalists.filter(
      (student) => String(student.angkatan) === String(selectedYear)
    )
  }, [selectedYear, currentFinalists])

  const summary = {
    total: currentFinalists.length,
    waiting: currentFinalists.filter(
      (student) => student.statusType === 'waiting'
    ).length,
    sent: currentFinalists.filter(
      (student) =>
        student.statusType === 'progress' ||
        student.statusType === 'completed'
    ).length,
    completed: currentFinalists.filter(
      (student) => student.statusType === 'completed'
    ).length,
  }

  const getActionLabel = (student) => {
    if (student.statusType === 'waiting') return 'Lihat Status'
    if (student.statusType === 'ready') return 'Kelola Penilai'
    if (student.statusType === 'progress') return 'Monitor'
    return 'Lihat Hasil'
  }

  return (
    <AdminShell>
      {/* PAGE HEADER */}
      <div className="finexy-page-header">
        <div>
          <h1>Pradita Value (Tahap 2)</h1>
          <p>
            Kelola asesmen karakter finalis Top 3 setiap angkatan melalui 3 rekan sejawat dan 2 dosen penilai.
          </p>
        </div>

        <div className="finexy-header-controls">
          <button
            type="button"
            className={`finexy-stage-btn ${isClosed ? 'reopen' : 'primary'}`}
            onClick={handleTogglePeriod}
            disabled={periodBusy}
          >
            {isClosed ? <Unlock size={15} /> : <Lock size={15} />}
            <span>
              {periodBusy
                ? 'Memproses...'
                : isClosed
                  ? 'Buka Kembali Tahap 1'
                  : 'Tutup Tahap 1 & Buka Pradita Value'}
            </span>
          </button>
        </div>
      </div>

      {periodFeedback && (
        <div className="finexy-alert-banner success">
          <span>{periodFeedback}</span>
          <button type="button" onClick={() => setPeriodFeedback('')}>
            ✕
          </button>
        </div>
      )}

      {/* BANNER JIKA PERIODE TAHAP 1 MASIH DIBUKA */}
      {!isClosed && (
        <div className="pv-locked-notice">
          <div className="pv-locked-left">
            <div className="pv-locked-icon">
              <Lock size={18} />
            </div>
            <div>
              <strong>Tahap Pradita Value Masih Terkunci</strong>
              <p>
                Saat ini periode seleksi <strong>Tahap 1 masih dibuka</strong>. Tutup periode Tahap 1 terlebih dahulu untuk menetapkan Top 3 setiap angkatan dan membuka pengisian rekan sejawat bagi finalis.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="finexy-stage-btn primary"
            onClick={handleTogglePeriod}
            disabled={periodBusy}
          >
            <Lock size={15} />
            <span>Tutup Tahap 1 Sekarang</span>
          </button>
        </div>
      )}

      {/* 4 STAT CARDS */}
      <section className="finexy-stats-row">
        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Total Finalis</span>
            <div className="finexy-stat-icon">
              <Trophy size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{summary.total}</strong>
            <span className="finexy-stat-badge rose">Top 3</span>
          </div>
          <p className="finexy-stat-foot">Maksimal 3 finalis per angkatan</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Menunggu Data</span>
            <div className="finexy-stat-icon">
              <Clock size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{summary.waiting}</strong>
            <span className="finexy-stat-badge amber">Menunggu</span>
          </div>
          <p className="finexy-stat-foot">Data rekan sejawat belum lengkap</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Form Terkirim</span>
            <div className="finexy-stat-icon">
              <Send size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{summary.sent}</strong>
            <span className="finexy-stat-badge neutral">Terkirim</span>
          </div>
          <p className="finexy-stat-foot">Kuesioner telah dikirim ke penilai</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Penilaian Lengkap</span>
            <div className="finexy-stat-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{summary.completed}</strong>
            <span className="finexy-stat-badge green">Selesai</span>
          </div>
          <p className="finexy-stat-foot">Seluruh 5 penilai telah merespons</p>
        </div>
      </section>

      {/* TABEL FINALIS PRADITA VALUE */}
      <section className="finexy-panel finexy-table-panel pv-table-card">
        <div className="pv-card-head">
          <div>
            <h2>Daftar Finalis Pradita Value</h2>
            <p>
              Tiga mahasiswa dengan skor Tahap 1 tertinggi dari setiap angkatan.
            </p>
          </div>

          <div className="pv-filter-pills">
            {[
              { value: '2024', label: 'Angkatan 2024' },
              { value: '2025', label: 'Angkatan 2025' },
              { value: '2026', label: 'Angkatan 2026' },
              { value: 'all', label: 'Semua Angkatan' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`pv-pill ${selectedYear === tab.value ? 'active' : ''}`}
                onClick={() => setSelectedYear(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="finexy-table-wrap">
          <table className="finexy-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Mahasiswa</th>
                <th>NIM</th>
                <th>Skor Tahap 1</th>
                <th>Rekan Sejawat</th>
                <th>Dosen Penilai</th>
                <th>Form Terkirim</th>
                <th>Respon</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinalists.length === 0 ? (
                <tr>
                  <td colSpan={10} className="finexy-table-empty">
                    {isClosed
                      ? 'Belum ada data finalis pada angkatan ini.'
                      : 'Finalis Top 3 akan muncul secara otomatis setelah periode Tahap 1 ditutup.'}
                  </td>
                </tr>
              ) : (
                filteredFinalists.map((student) => {
                  const statusClass =
                    student.statusType === 'completed'
                      ? 'approved'
                      : student.statusType === 'waiting'
                        ? 'revision'
                        : 'review'

                  return (
                    <tr key={student.id}>
                      <td>
                        <span
                          className={`pv-rank-badge ${
                            student.rank <= 3 ? `rank-${student.rank}` : ''
                          }`}
                        >
                          #{student.rank}
                        </span>
                      </td>
                      <td>
                        <div className="finexy-student-cell">
                          <div className="finexy-student-avatar">
                            {student.initials}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>
                              Sistem Informasi • {student.angkatan}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="finexy-td-nim">{student.nim}</td>
                      <td className="finexy-td-score">
                        {Number(student.tahap1 || 0).toFixed(2)}
                      </td>
                      <td>
                        <ProgressPill value={student.peers} total={3} />
                      </td>
                      <td>
                        <ProgressPill value={student.lecturers} total={2} />
                      </td>
                      <td>
                        <ProgressPill value={student.formsSent} total={5} />
                      </td>
                      <td>
                        <ProgressPill
                          value={student.responses}
                          total={5}
                          highlight={student.responses === 5}
                        />
                      </td>
                      <td>
                        <span className={`finexy-status-pill ${statusClass}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="finexy-row-btn primary"
                          onClick={() =>
                            navigate(`/admin/pradita-value/${student.nim}`)
                          }
                        >
                          <span>{getActionLabel(student)}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* INFO BANNER BAWAH */}
        <div className="pv-info-banner">
          <div className="pv-info-icon">
            <Info size={16} />
          </div>
          <div>
            <strong>Mekanisme Asesmen Pradita Value</strong>
            <p>
              Setiap finalis dinilai oleh <strong>3 rekan sejawat</strong> (diajukan oleh mahasiswa) dan <strong>2 dosen</strong> (Kaprodi serta 1 dosen penilai). Setiap penilai menerima tautan kuesioner dengan token satu kali pakai melalui email.
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

function ProgressPill({ value = 0, total = 5, highlight = false }) {
  const isComplete = value >= total
  return (
    <span
      className={`pv-progress-pill ${
        highlight || isComplete
          ? 'complete'
          : value > 0
            ? 'partial'
            : 'empty'
      }`}
    >
      {value}/{total}
    </span>
  )
}

export default PraditaValue
