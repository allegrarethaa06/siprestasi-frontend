import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  Eye,
  GraduationCap,
  Info,
  Lock,
  Trophy,
  Unlock,
  Users,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import { api } from '../../api'
import {
  closeSelectionPeriod,
  fetchCurrentPeriod,
  openSelectionPeriod,
} from '../../data/admin'

import './PeringkatTahap1.css'

function PeringkatTahap1() {
  const navigate = useNavigate()

  const [selectedAngkatan, setSelectedAngkatan] = useState('2024')
  const [serverRanking, setServerRanking] = useState({})
  const [periode, setPeriode] = useState(null)
  const [periodBusy, setPeriodBusy] = useState(false)
  const [periodFeedback, setPeriodFeedback] = useState('')

  const loadRankingAndPeriod = () => {
    const years = ['2024', '2025', '2026']
    Promise.allSettled(
      years.map((yr) =>
        api(`pengajuan/ranking?angkatan=${yr}`).then((res) => ({
          year: yr,
          data: res?.data || [],
        }))
      )
    ).then((results) => {
      const map = {}
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value.data.length > 0) {
          map[r.value.year] = r.value.data.map((row) => {
            const initials = row.name
              ? row.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
              : 'M'
            return {
              id: row.sub_id,
              name: row.name,
              initials: initials || 'M',
              nim: row.induk,
              prodi: 'Sistem Informasi',
              angkatan: String(row.year),
              score: Number(row.total_score || 0),
            }
          })
        }
      })
      setServerRanking(map)
    })

    fetchCurrentPeriod()
      .then((res) => {
        if (res?.data) setPeriode(res.data)
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadRankingAndPeriod()
  }, [])

  const isClosed = Boolean(Number(periode?.is_closed ?? 0))

  const handleTogglePeriod = async () => {
    if (periodBusy) return
    setPeriodBusy(true)
    setPeriodFeedback('')
    try {
      if (isClosed) {
        const res = await openSelectionPeriod()
        setPeriode(res?.data || { ...(periode || {}), is_closed: false })
        setPeriodFeedback('Periode Tahap 1 dibuka kembali.')
      } else {
        const res = await closeSelectionPeriod()
        setPeriode(res?.data || { ...(periode || {}), is_closed: true })
        setPeriodFeedback(
          'Periode Tahap 1 ditutup! Top 3 tiap angkatan telah dikunci untuk Pradita Value.'
        )
      }
      loadRankingAndPeriod()
    } catch (err) {
      setPeriodFeedback(err?.message || 'Gagal memperbarui status periode.')
    } finally {
      setPeriodBusy(false)
    }
  }

  const currentRanking = useMemo(() => {
    if (selectedAngkatan === 'all') {
      const serverAll = Object.values(serverRanking).flat()
      return [...serverAll]
        .sort((a, b) => b.score - a.score)
        .map((student, index) => ({
          ...student,
          displayRank: index + 1,
        }))
    }

    if (
      serverRanking[selectedAngkatan] &&
      serverRanking[selectedAngkatan].length > 0
    ) {
      return [...serverRanking[selectedAngkatan]]
        .sort((a, b) => b.score - a.score)
        .map((student, index) => ({
          ...student,
          displayRank: index + 1,
        }))
    }

    return []
  }, [selectedAngkatan, serverRanking])

  const totalPeserta = useMemo(
    () => Object.values(serverRanking).flat().length,
    [serverRanking]
  )
  const totalAngkatan = useMemo(
    () =>
      Object.keys(serverRanking).filter(
        (k) => (serverRanking[k] || []).length > 0
      ).length,
    [serverRanking]
  )
  const totalFinalis = useMemo(
    () =>
      Object.values(serverRanking).reduce(
        (acc, arr) => acc + Math.min(arr.length, 3),
        0
      ),
    [serverRanking]
  )

  return (
    <AdminShell>
      {/* PAGE HEADER */}
      <div className="finexy-page-header">
        <div>
          <h1>Peringkat Tahap 1</h1>
          <p>
            Pantau peringkat kandidat per angkatan berdasarkan akumulasi skor berkas Tahap 1.
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

      {/* 3 STAT CARDS */}
      <section className="rank1-kpi-grid">
        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Total Peserta Tahap 1</span>
            <div className="finexy-stat-icon">
              <Users size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{totalPeserta}</strong>
            <span className="finexy-stat-badge neutral">Terdaftar</span>
          </div>
          <p className="finexy-stat-foot">Seluruh mahasiswa peserta seleksi</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Angkatan Aktif</span>
            <div className="finexy-stat-icon">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{totalAngkatan || 3}</strong>
            <span className="finexy-stat-badge rose">Angkatan</span>
          </div>
          <p className="finexy-stat-foot">Angkatan 2024, 2025, dan 2026</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Kandidat Finalis Top 3</span>
            <div className="finexy-stat-icon">
              <Trophy size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{totalFinalis}</strong>
            <span className="finexy-stat-badge green">
              {isClosed ? 'Finalis Terkunci' : 'Kandidat Sementara'}
            </span>
          </div>
          <p className="finexy-stat-foot">Maksimal 3 terbaik per angkatan</p>
        </div>
      </section>

      {/* TABEL PERINGKAT */}
      <section className="finexy-panel finexy-table-panel rank1-table-card">
        <div className="rank1-card-head">
          <div>
            <h2>Daftar Peringkat Mahasiswa</h2>
            <p>
              {selectedAngkatan === 'all'
                ? 'Menampilkan urutan mahasiswa yang telah diverifikasi & disetujui Admin lintas angkatan berdasarkan Skor Tahap 1.'
                : `Menampilkan daftar peringkat mahasiswa Angkatan ${selectedAngkatan} yang telah disetujui (Top 3 kandidat melaju ke Pradita Value).`}
            </p>
          </div>

          <div className="rank1-filter-pills">
            {[
              { value: '2024', label: 'Angkatan 2024' },
              { value: '2025', label: 'Angkatan 2025' },
              { value: '2026', label: 'Angkatan 2026' },
              { value: 'all', label: 'Semua Angkatan' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`rank1-pill ${selectedAngkatan === tab.value ? 'active' : ''}`}
                onClick={() => setSelectedAngkatan(tab.value)}
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
                <th>Peringkat</th>
                <th>Mahasiswa</th>
                <th>NIM</th>
                <th>Angkatan</th>
                <th>Program Studi</th>
                <th>Skor Tahap 1</th>
                <th>Status Seleksi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentRanking.length === 0 ? (
                <tr>
                  <td colSpan={8} className="finexy-table-empty">
                    Belum ada data mahasiswa berstatus Disetujui pada pilihan angkatan ini.
                  </td>
                </tr>
              ) : (
                currentRanking.map((student) => {
                  const isTop3 =
                    selectedAngkatan !== 'all'
                      ? student.displayRank <= 3
                      : student.displayRank <= 3
                  return (
                    <tr key={student.id}>
                      <td>
                        <span
                          className={`rank1-badge ${
                            student.displayRank <= 3
                              ? `rank-${student.displayRank}`
                              : ''
                          }`}
                        >
                          #{student.displayRank}
                        </span>
                      </td>
                      <td>
                        <div className="finexy-student-cell">
                          <div className="finexy-student-avatar">
                            {student.initials}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>Mahasiswa Berprestasi</span>
                          </div>
                        </div>
                      </td>
                      <td className="finexy-td-nim">{student.nim}</td>
                      <td>{student.angkatan}</td>
                      <td>{student.prodi}</td>
                      <td className="finexy-td-score">
                        {student.score.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`finexy-status-pill ${
                            isTop3 ? 'approved' : 'neutral'
                          }`}
                        >
                          {isClosed && isTop3
                            ? 'Lolos Top 3'
                            : isTop3
                              ? 'Kandidat Top 3'
                              : 'Peserta Disetujui'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="finexy-row-btn"
                          onClick={() =>
                            navigate(
                              `/admin/daftar-mapres/${student.nim}/detail`
                            )
                          }
                        >
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* CATATAN INFO BAWAH */}
        <div className="rank1-info-banner">
          <div className="rank1-info-icon">
            {isClosed ? <Award size={16} /> : <Info size={16} />}
          </div>
          <div>
            <strong>
              {isClosed
                ? 'Periode Tahap 1 Ditutup — Finalis Top 3 Telah Ditetapkan'
                : 'Peringkat Sementara Tahap 1'}
            </strong>
            <p>
              {isClosed
                ? 'Tiga mahasiswa terbaik dari masing-masing angkatan telah resmi masuk ke tahap penilaian Pradita Value.'
                : 'Peringkat masih dapat berubah selama proses verifikasi berkas berlangsung. Tutup periode Tahap 1 untuk mengunci Top 3 per angkatan dan membuka Pradita Value.'}
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default PeringkatTahap1
