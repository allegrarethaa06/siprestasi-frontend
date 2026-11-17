import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  GraduationCap,
  Info,
  Trophy,
  Users,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import { fetchAdminFinalists } from '../../data/admin'

import './HasilSeleksi.css'

function HasilSeleksi() {
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState('2024')
  const [serverFinalists, setServerFinalists] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchAdminFinalists()
      .then((res) => {
        if (!cancelled && res?.data && res.data.length > 0) {
          const mapped = res.data.map((f) => {
            const hasPv = f.pv_result !== null && f.pv_result !== undefined
            const pvScore = hasPv ? Number(f.pv_result) : null
            const tahap1Score = Number(f.tahap1 || 0)
            const finalScore = hasPv
              ? Number((tahap1Score + pvScore).toFixed(2))
              : null
            return {
              id: f.id,
              rank: f.rank,
              initials: f.initials || 'M',
              name: f.name,
              nim: f.nim,
              prodi: 'Sistem Informasi',
              angkatan: String(f.angkatan),
              tahap1: tahap1Score,
              praditaValue: pvScore,
              finalScore,
              status: hasPv
                ? f.rank === 1
                  ? 'Juara 1'
                  : `Peringkat ${f.rank}`
                : 'Menunggu Pradita Value',
              statusType: hasPv
                ? f.rank === 1
                  ? 'winner'
                  : 'ranked'
                : 'waiting',
            }
          })
          setServerFinalists(mapped)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const activeFinalists = serverFinalists

  const displayedResults = useMemo(() => {
    if (selectedYear === 'all') {
      return [...activeFinalists]
        .sort(
          (a, b) =>
            (b.finalScore ?? b.tahap1) - (a.finalScore ?? a.tahap1)
        )
        .map((student, index) => ({
          ...student,
          displayRank: index + 1,
        }))
    }

    return activeFinalists
      .filter((student) => String(student.angkatan) === String(selectedYear))
      .sort(
        (a, b) =>
          (b.finalScore ?? b.tahap1) - (a.finalScore ?? a.tahap1)
      )
      .map((student, idx) => ({
        ...student,
        displayRank: idx + 1,
      }))
  }, [selectedYear, activeFinalists])

  const totalFinalis = activeFinalists.length
  const distinctAngkatan = useMemo(
    () => new Set(activeFinalists.map((f) => f.angkatan)).size,
    [activeFinalists]
  )
  const completedPv = useMemo(
    () => activeFinalists.filter((f) => f.finalScore !== null).length,
    [activeFinalists]
  )
  const totalPemenang = useMemo(
    () =>
      activeFinalists.filter(
        (f) => f.rank === 1 && f.finalScore !== null
      ).length,
    [activeFinalists]
  )

  const winner = displayedResults[0]

  return (
    <AdminShell>
      {/* PAGE HEADER */}
      <div className="finexy-page-header">
        <div>
          <h1>Hasil Akhir Seleksi</h1>
          <p>
            Rekapitulasi nilai gabungan Tahap 1 dan Pradita Value (Tahap 2) untuk penentuan Mahasiswa Berprestasi.
          </p>
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <section className="finexy-stats-row">
        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Total Finalis</span>
            <div className="finexy-stat-icon">
              <Users size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{totalFinalis}</strong>
            <span className="finexy-stat-badge rose">Top 3</span>
          </div>
          <p className="finexy-stat-foot">Finalis seluruh angkatan</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Angkatan Terdaftar</span>
            <div className="finexy-stat-icon">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{distinctAngkatan || 3}</strong>
            <span className="finexy-stat-badge neutral">Angkatan</span>
          </div>
          <p className="finexy-stat-foot">Angkatan 2024, 2025, dan 2026</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Asesmen Selesai</span>
            <div className="finexy-stat-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{completedPv}</strong>
            <span className="finexy-stat-badge green">Lengkap</span>
          </div>
          <p className="finexy-stat-foot">Nilai Pradita Value telah masuk</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Juara 1 Ditetapkan</span>
            <div className="finexy-stat-icon">
              <Trophy size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{totalPemenang}</strong>
            <span className="finexy-stat-badge amber">Pemenang</span>
          </div>
          <p className="finexy-stat-foot">Juara 1 dari setiap angkatan</p>
        </div>
      </section>

      {/* KARTU HIGHLIGHT JUARA 1 (JIKA SUDAH ADA NILAI AKHIR) */}
      {winner && winner.finalScore !== null && (
        <section className="hasil-winner-banner">
          <div className="hasil-winner-left">
            <div className="hasil-winner-trophy">
              <Trophy size={22} />
            </div>
            <div className="hasil-winner-avatar">{winner.initials}</div>
            <div className="hasil-winner-copy">
              <span className="hasil-winner-label">
                {selectedYear === 'all'
                  ? 'Peringkat 1 Seluruh Angkatan'
                  : `Juara 1 Angkatan ${selectedYear}`}
              </span>
              <h3>{winner.name}</h3>
              <p>
                NIM {winner.nim} • {winner.prodi} • Angkatan {winner.angkatan}
              </p>
            </div>
          </div>

          <div className="hasil-winner-score">
            <span>Nilai Akhir</span>
            <strong>{winner.finalScore.toFixed(2)}</strong>
          </div>
        </section>
      )}

      {/* TABEL PERINGKAT AKHIR */}
      <section className="finexy-panel finexy-table-panel hasil-table-card">
        <div className="hasil-card-head">
          <div>
            <h2>Peringkat Akhir Mahasiswa Berprestasi</h2>
            <p>
              Akumulasi skor berkas Tahap 1 dan nilai asesmen Pradita Value.
            </p>
          </div>

          <div className="hasil-filter-pills">
            {[
              { value: '2024', label: 'Angkatan 2024' },
              { value: '2025', label: 'Angkatan 2025' },
              { value: '2026', label: 'Angkatan 2026' },
              { value: 'all', label: 'Semua Angkatan' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`hasil-pill ${selectedYear === tab.value ? 'active' : ''}`}
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
                <th>Peringkat</th>
                <th>Mahasiswa</th>
                <th>NIM</th>
                <th>Angkatan</th>
                <th>Skor Tahap 1</th>
                <th>Pradita Value</th>
                <th>Nilai Akhir</th>
                <th>Status Hasil</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="finexy-table-empty">
                    Belum ada data finalis pada pilihan angkatan ini.
                  </td>
                </tr>
              ) : (
                displayedResults.map((student) => {
                  const isWinner =
                    student.displayRank === 1 && student.finalScore !== null
                  const statusClass = isWinner
                    ? 'approved'
                    : student.finalScore !== null
                      ? 'review'
                      : 'revision'

                  return (
                    <tr key={student.id}>
                      <td>
                        <span
                          className={`hasil-rank-badge ${
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
                            <span>{student.prodi}</span>
                          </div>
                        </div>
                      </td>
                      <td className="finexy-td-nim">{student.nim}</td>
                      <td>{student.angkatan}</td>
                      <td className="finexy-td-score">
                        {student.tahap1.toFixed(2)}
                      </td>
                      <td className="finexy-td-score">
                        {student.praditaValue !== null
                          ? student.praditaValue.toFixed(2)
                          : '—'}
                      </td>
                      <td>
                        {student.finalScore !== null ? (
                          <strong className="hasil-final-val">
                            {student.finalScore.toFixed(2)}
                          </strong>
                        ) : (
                          <span className="hasil-dash">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`finexy-status-pill ${statusClass}`}>
                          {isWinner
                            ? 'Juara 1'
                            : student.finalScore !== null
                              ? `Peringkat ${student.displayRank}`
                              : 'Menunggu Pradita Value'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="finexy-row-btn"
                          onClick={() =>
                            navigate(`/admin/pradita-value/${student.nim}`)
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

        <div className="hasil-info-banner">
          <div className="hasil-info-icon">
            <Award size={16} />
          </div>
          <div>
            <strong>Perhitungan Nilai Akhir</strong>
            <p>
              Nilai Akhir dihitung otomatis setelah 5 penilai (3 rekan sejawat dan 2 dosen) menyelesaikan pengisian kuesioner Pradita Value pada masing-masing finalis.
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default HasilSeleksi
