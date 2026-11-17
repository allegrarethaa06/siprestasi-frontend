import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Filter,
  RotateCcw,
  Search,
  Users,
  X,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import { fetchAdminSubmissions } from '../../data/admin'
import './DaftarMapres.css'

function DaftarMapres() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [angkatan, setAngkatan] = useState('Semua')
  const [status, setStatus] = useState(location.state?.statusFilter || 'Semua')
  const [kelengkapan, setKelengkapan] = useState('Semua')
  const [sortOrder, setSortOrder] = useState('terbaru')
  const [page, setPage] = useState(1)

  const rowsPerPage = 8

  const [serverStudents, setServerStudents] = useState([])
  const [serverStats, setServerStats] = useState(null)

  useEffect(() => {
    let ignore = false
    fetchAdminSubmissions({ year: angkatan, status, q: search })
      .then((res) => {
        if (!ignore && res?.data) {
          setServerStudents(res.data)
          if (res.stats) setServerStats(res.stats)
        }
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [angkatan, status, search])

  const students = serverStudents

  const summaryCards = [
    {
      title: 'Semua Pengajuan',
      value: serverStats?.total ?? students.length,
      badge: 'Total',
      badgeType: 'neutral',
      description: 'Seluruh berkas mahasiswa terdaftar',
      filterValue: 'Semua',
      Icon: Users,
    },
    {
      title: 'Perlu Ditinjau',
      value: serverStats?.perlu_ditinjau ?? 0,
      badge: 'Menunggu',
      badgeType: 'amber',
      description: 'Menunggu verifikasi berkas Tahap 1',
      filterValue: 'Perlu Ditinjau',
      Icon: ClipboardCheck,
    },
    {
      title: 'Perlu Revisi',
      value: serverStats?.perlu_revisi ?? 0,
      badge: 'Perbaikan',
      badgeType: 'rose',
      description: 'Menunggu unggah ulang mahasiswa',
      filterValue: 'Perlu Revisi',
      Icon: RotateCcw,
    },
    {
      title: 'Disetujui',
      value: serverStats?.disetujui ?? 0,
      badge: 'Terverifikasi',
      badgeType: 'green',
      description: 'Lolos verifikasi berkas Tahap 1',
      filterValue: 'Disetujui',
      Icon: CheckCircle2,
    },
  ]

  const filteredStudents = useMemo(() => {
    let result = [...students]
    const keyword = search.trim().toLowerCase()

    if (keyword) {
      result = result.filter(
        (student) =>
          student.name?.toLowerCase().includes(keyword) ||
          student.nim?.toLowerCase().includes(keyword)
      )
    }

    if (angkatan !== 'Semua') {
      result = result.filter(
        (student) => String(student.angkatan) === String(angkatan)
      )
    }

    if (status !== 'Semua') {
      result = result.filter(
        (student) => student.status?.toLowerCase() === status.toLowerCase()
      )
    }

    if (kelengkapan === 'Lengkap') {
      result = result.filter(
        (student) => student.completenessType === 'complete'
      )
    } else if (kelengkapan === 'Belum Lengkap') {
      result = result.filter(
        (student) => student.completenessType !== 'complete'
      )
    }

    if (sortOrder === 'terlama') {
      result.reverse()
    }

    return result
  }, [students, search, angkatan, status, kelengkapan, sortOrder])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / rowsPerPage)
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredStudents.length
  )
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + rowsPerPage
  )

  const hasActiveFilter =
    search !== '' ||
    angkatan !== 'Semua' ||
    status !== 'Semua' ||
    kelengkapan !== 'Semua' ||
    sortOrder !== 'terbaru'

  const resetFilter = () => {
    setSearch('')
    setAngkatan('Semua')
    setStatus('Semua')
    setKelengkapan('Semua')
    setSortOrder('terbaru')
    setPage(1)
  }

  return (
    <AdminShell
      searchValue={search}
      onSearchChange={(val) => {
        setSearch(val)
        setPage(1)
      }}
    >
      {/* HEADER BARIS ATAS */}
      <div className="finexy-page-header">
        <div>
          <h1>Verifikasi Tahap 1</h1>
          <p>
            Periksa kelengkapan dan keaslian dokumen prestasi, organisasi, serta bahasa asing mahasiswa.
          </p>
        </div>

        <div className="finexy-header-controls">
          <button
            type="button"
            className="finexy-stage-btn primary"
            onClick={() => navigate('/admin/peringkat-tahap-1')}
          >
            <BarChart3 size={15} />
            <span>Lihat Peringkat Tahap 1</span>
          </button>
        </div>
      </div>

      {/* 4 INTERACTIVE SUMMARY CARDS */}
      <section className="finexy-stats-row">
        {summaryCards.map((card) => {
          const IconComp = card.Icon
          const isSelected = status === card.filterValue
          return (
            <button
              key={card.title}
              type="button"
              className={`finexy-stat-card mapres-stat-clickable ${
                isSelected ? 'is-selected' : ''
              }`}
              onClick={() => {
                setStatus(card.filterValue)
                setPage(1)
              }}
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

              <p className="finexy-stat-foot">{card.description}</p>
            </button>
          )
        })}
      </section>

      {/* TABEL DAFTAR PENGAJUAN */}
      <section className="finexy-panel finexy-table-panel">
        <div className="finexy-table-head">
          <div>
            <h2>Daftar Pengajuan Mahasiswa</h2>
            <p>
              Menampilkan {filteredStudents.length === 0 ? 0 : startIndex + 1}–{endIndex} dari{' '}
              {filteredStudents.length} pengajuan
            </p>
          </div>

          <div className="finexy-table-tools">
            <div className="finexy-mini-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Cari nama / NIM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="finexy-filter-select">
              <Filter size={14} />
              <select
                value={angkatan}
                onChange={(e) => {
                  setAngkatan(e.target.value)
                  setPage(1)
                }}
              >
                <option value="Semua">Semua Angkatan</option>
                <option value="2024">Angkatan 2024</option>
                <option value="2025">Angkatan 2025</option>
                <option value="2026">Angkatan 2026</option>
              </select>
            </div>

            <div className="finexy-filter-select">
              <Filter size={14} />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(1)
                }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Perlu Ditinjau">Perlu Ditinjau</option>
                <option value="Perlu Revisi">Perlu Revisi</option>
                <option value="Disetujui">Disetujui</option>
              </select>
            </div>

            <div className="finexy-filter-select">
              <ArrowUpDown size={14} />
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value)
                  setPage(1)
                }}
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                className="mapres-reset-pill"
                onClick={resetFilter}
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
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
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="finexy-table-empty">
                    Tidak ada pengajuan mahasiswa yang cocok dengan filter saat ini.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const statusClass =
                    student.status === 'Disetujui'
                      ? 'approved'
                      : student.status === 'Perlu Revisi'
                        ? 'revision'
                        : 'review'

                  const actionLabel =
                    student.status === 'Disetujui'
                      ? 'Lihat Detail'
                      : student.status === 'Perlu Revisi'
                        ? 'Tinjau Revisi'
                        : 'Verifikasi'

                  return (
                    <tr key={student.sub_id || student.nim}>
                      <td className="finexy-td-nim">{student.nim}</td>
                      <td className="finexy-td-date">
                        <Clock size={13} />
                        <span>{student.tanggal || '-'}</span>
                      </td>
                      <td>
                        <div className="finexy-student-cell">
                          <div className="finexy-student-avatar">
                            {student.initials || 'M'}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>Sistem Informasi</span>
                          </div>
                        </div>
                      </td>
                      <td>{student.angkatan}</td>
                      <td>
                        <span className="finexy-completeness-text">
                          {student.kelengkapan || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`finexy-status-pill ${statusClass}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="finexy-td-score">
                        {student.total_score != null
                          ? Number(student.total_score).toFixed(2)
                          : '0.00'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`finexy-row-btn ${
                            actionLabel === 'Verifikasi' ||
                            actionLabel === 'Tinjau Revisi'
                              ? 'primary'
                              : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (actionLabel === 'Verifikasi') {
                              navigate(
                                `/admin/daftar-mapres/${student.nim}/verifikasi`
                              )
                            } else if (actionLabel === 'Tinjau Revisi') {
                              navigate(
                                `/admin/daftar-mapres/${student.nim}/revisi`
                              )
                            } else {
                              navigate(
                                `/admin/daftar-mapres/${student.nim}/detail`
                              )
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

        {/* PAGINATION */}
        <div className="mapres-pagination-bar">
          <span className="mapres-page-info">
            Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
          </span>

          <div className="mapres-page-controls">
            <button
              type="button"
              className="mapres-page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={15} />
              <span>Sebelumnya</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`mapres-page-num ${
                    page === pageNum ? 'active' : ''
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              type="button"
              className="mapres-page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Berikutnya</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </AdminShell>
  )
}

export default DaftarMapres
