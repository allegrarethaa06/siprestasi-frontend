import { useEffect, useMemo, useState } from 'react'
import SuperadminNavbar from '../components/SuperadminNavbar'
import './DaftarMapres.css'
import SuperadminHeader from '../components/SuperadminHeader' 
import { useNavigate } from 'react-router-dom' 
import {
  SubmissionIcon,
  ReviewIcon,
  RevisionIcon,
  ApprovedIcon,
} from '../components/SummaryIcons' 


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function RankingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20V10h4v10" />
      <path d="M10 20V4h4v16" />
      <path d="M16 20v-7h4v7" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h11" />
      <path d="M4 18h6" />
    </svg>
  )
}

const programs = [
  'S1 Informatika',
  'S1 Sistem Informasi',
  'S1 Teknik Industri',
  'S1 Manajemen Bisnis',
]

const years = ['2024', '2025', '2026']

function createDummyStudents({
  count,
  start,
  status,
  statusType,
  action,
  actionType,
}) {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index
    const year = years[index % years.length]

    return {
      initials: `M${number}`,
      name: `Mahasiswa ${number}`,
      prodi: programs[index % programs.length],
      nim: `2410102${String(number).padStart(3, '0')}`,
      angkatan: year,
      kelengkapan: '5/5 Lengkap',
      completenessType: 'complete',
      status,
      statusType,
      tanggal: `${String(
        Math.max(1, 28 - index)
      ).padStart(2, '0')} Feb 2026, 10:00 WIB`,
      action,
      actionType,
      timestamp: 100 - number,
    }
  })
}

function DaftarMapres() {
  const navigate = useNavigate() 
  const [search, setSearch] = useState('')
  const [angkatan, setAngkatan] = useState('Semua')
  const [status, setStatus] = useState('Semua')
  const [kelengkapan, setKelengkapan] =
    useState('Semua')
  const [sortOrder, setSortOrder] =
    useState('terbaru')
  const [page, setPage] = useState(1)

  const rowsPerPage = 8

  const students = useMemo(() => {
    const reviewStudents = [
      {
        initials: 'AR',
        name: 'Ahmad Rizky Pratama',
        prodi: 'S1 Informatika',
        nim: '13521048',
        angkatan: '2025',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Perlu Ditinjau',
        statusType: 'review',
        tanggal: '20 Feb 2026, 14:30 WIB',
        action: 'Verifikasi Pengajuan',
        actionType: 'primary',
        timestamp: 100,
      },

      {
        initials: 'MF',
        name: 'Muhammad Farhan',
        prodi: 'S1 Teknik Industri',
        nim: '13522033',
        angkatan: '2026',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Perlu Ditinjau',
        statusType: 'review',
        tanggal: '17 Feb 2026, 15:10 WIB',
        action: 'Verifikasi Pengajuan',
        actionType: 'primary',
        timestamp: 99,
      },

      {
        initials: 'BA',
        name: 'Bagas Aditya Rahman',
        prodi: 'S1 Sistem Informasi',
        nim: '13521066',
        angkatan: '2025',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Perlu Ditinjau',
        statusType: 'review',
        tanggal: '16 Feb 2026, 10:05 WIB',
        action: 'Verifikasi Pengajuan',
        actionType: 'primary',
        timestamp: 98,
      },

      ...createDummyStudents({
        count: 15,
        start: 9,
        status: 'Perlu Ditinjau',
        statusType: 'review',
        action: 'Verifikasi Pengajuan',
        actionType: 'primary',
      }),
    ]

    const approvedStudents = [
      {
        initials: 'SN',
        name: 'Siti Nurhaliza',
        prodi: 'S1 Sistem Informasi',
        nim: '13521012',
        angkatan: '2024',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Disetujui',
        statusType: 'approved',
        tanggal: '19 Feb 2026, 09:15 WIB',
        action: 'Lihat Detail',
        actionType: 'secondary',
        timestamp: 97,
      },

      {
        initials: 'AP',
        name: 'Amanda Putri',
        prodi: 'S1 Informatika',
        nim: '13521089',
        angkatan: '2025',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Disetujui',
        statusType: 'approved',
        tanggal: '18 Feb 2026, 11:20 WIB',
        action: 'Lihat Detail',
        actionType: 'secondary',
        timestamp: 96,
      },

      ...createDummyStudents({
        count: 14,
        start: 24,
        status: 'Disetujui',
        statusType: 'approved',
        action: 'Lihat Detail',
        actionType: 'secondary',
      }),
    ]

    const revisionStudents = [
      {
        initials: 'KJ',
        name: 'Kevin Jonathan',
        prodi: 'S1 Desain Komunikasi Visual',
        nim: '13522005',
        angkatan: '2026',
        kelengkapan: '4/5 Lengkap',
        completenessType: 'partial',
        status: 'Revisi Dikirim Ulang',
        statusType: 'revision',
        tanggal: '18 Feb 2026, 16:45 WIB',
        action: 'Tinjau Revisi',
        actionType: 'secondary',
        timestamp: 95,
      },

      {
        initials: 'RF',
        name: 'Reza Firmansyah',
        prodi: 'S1 Teknik Industri',
        nim: '13520011',
        angkatan: '2024',
        kelengkapan: '5/5 Lengkap',
        completenessType: 'complete',
        status: 'Menunggu Mahasiswa',
        statusType: 'waiting',
        tanggal: '15 Feb 2026, 13:40 WIB',
        action: 'Lihat Detail',
        actionType: 'secondary',
        timestamp: 94,
      },

      ...createDummyStudents({
        count: 2,
        start: 38,
        status: 'Revisi Dikirim Ulang',
        statusType: 'revision',
        action: 'Tinjau Revisi',
        actionType: 'secondary',
      }),

      ...createDummyStudents({
        count: 2,
        start: 40,
        status: 'Menunggu Mahasiswa',
        statusType: 'waiting',
        action: 'Lihat Detail',
        actionType: 'secondary',
      }),
    ]

    return [
      ...reviewStudents,
      ...approvedStudents,
      ...revisionStudents,
    ]
  }, [])

  const summaryCards = [
  {
    title: 'Semua Pengajuan',
    value: 42,
    description: 'Total mahasiswa terdaftar',
    filterValue: 'Semua',
    icon: <SubmissionIcon />,
  },
  {
    title: 'Perlu Ditinjau',
    value: 18,
    description: 'Menunggu verifikasi Tahap 1',
    filterValue: 'Perlu Ditinjau',
    icon: <ReviewIcon />,
  },
  {
    title: 'Perlu Revisi',
    value: 6,
    description: 'Menunggu perbaikan berkas',
    filterValue: 'Perlu Revisi',
    icon: <RevisionIcon />,
  },
  {
    title: 'Disetujui',
    value: 16,
    description: 'Lolos verifikasi Tahap 1',
    filterValue: 'Disetujui',
    icon: <ApprovedIcon />,
  },
]

  const filteredStudents = useMemo(() => {
    let result = [...students]

    const keyword = search.trim().toLowerCase()

    if (keyword) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(keyword) ||
          student.nim.includes(keyword)
      )
    }

    if (angkatan !== 'Semua') {
      result = result.filter(
        (student) =>
          student.angkatan === angkatan
      )
    }

    if (status === 'Perlu Revisi') {
      result = result.filter(
        (student) =>
          student.status === 'Revisi Dikirim Ulang' ||
          student.status === 'Menunggu Mahasiswa'
      )
    } else if (status !== 'Semua') {
      result = result.filter(
        (student) =>
          student.status === status
      )
    }

    if (kelengkapan === 'Lengkap') {
      result = result.filter(
        (student) =>
          student.completenessType === 'complete'
      )
    }

    if (kelengkapan === 'Belum Lengkap') {
      result = result.filter(
        (student) =>
          student.completenessType !== 'complete'
      )
    }

    result.sort((a, b) =>
      sortOrder === 'terbaru'
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp
    )

    return result
  }, [
    students,
    search,
    angkatan,
    status,
    kelengkapan,
    sortOrder,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredStudents.length / rowsPerPage
    )
  )

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const startIndex =
    (page - 1) * rowsPerPage

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredStudents.length
  )

  const paginatedStudents =
    filteredStudents.slice(
      startIndex,
      startIndex + rowsPerPage
    )

  const handleSummaryClick = (value) => {
    setStatus(value)
    setPage(1)
  }

  const resetFilter = () => {
    setSearch('')
    setAngkatan('Semua')
    setStatus('Semua')
    setKelengkapan('Semua')
    setSortOrder('terbaru')
    setPage(1)
  }

  return (
    <div className="mapres-page">

      <div className="admin-top-section">

        <SuperadminNavbar />

        <SuperadminHeader
          title="Daftar Mahasiswa Berprestasi"
          description="Kelola proses verifikasi dan seleksi administrasi Mahasiswa Berprestasi."
          showRankingButton={true}
          onRankingClick={() =>
            navigate('/superadmin/daftar-mapres/ranking')
          }
        />

      </div>

      <main className="mapres-content">

        {/* SUMMARY CARDS */}

        <section className="mapres-summary-grid">

          {summaryCards.map((card) => (
            <button
  key={card.title}
  type="button"
  className={`mapres-summary-card ${
    status === card.filterValue ? 'active' : ''
  }`}
  onClick={() => {
    setStatus(card.filterValue)
    setPage(1)
  }}
>
  <div className="mapres-summary-copy">
    <span className="mapres-summary-title">
      {card.title}
    </span>

    <strong>{card.value}</strong>

    <p>{card.description}</p>
  </div>

  <div className="mapres-summary-icon">
    {card.icon}
  </div>
</button>
          ))}

        </section>

        {/* FILTER */}

        <section className="filter-section">

          <div className="mapres-filter">

            <div className="search-box">

              <SearchIcon />

              <input
                type="text"
                placeholder="Cari nama atau NIM..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />

            </div>

            <select
              value={angkatan}
              onChange={(e) => {
                setAngkatan(e.target.value)
                setPage(1)
              }}
            >
              <option value="Semua">
                Semua Angkatan
              </option>

              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            >
              <option value="Semua">
                Semua Status
              </option>

              <option value="Perlu Ditinjau">
                Perlu Ditinjau
              </option>

              <option value="Perlu Revisi">
                Perlu Revisi
              </option>

              <option value="Disetujui">
                Disetujui
              </option>
            
            </select>

            <select
              value={kelengkapan}
              onChange={(e) => {
                setKelengkapan(
                  e.target.value
                )
                setPage(1)
              }}
            >
              <option value="Semua">
                Semua Kelengkapan
              </option>

              <option value="Lengkap">
                Lengkap
              </option>

              <option value="Belum Lengkap">
                Belum Lengkap
              </option>
            </select>

            <button
              type="button"
              className="reset-filter"
              onClick={resetFilter}
            >
              ↻ Reset Filter
            </button>

            <button
              type="button"
              className="sort-button"
              onClick={() => {
                setSortOrder((prev) =>
                  prev === 'terbaru'
                    ? 'terlama'
                    : 'terbaru'
                )

                setPage(1)
              }}
            >
              <SortIcon />

              <span>Urutkan:</span>

              <strong>
                {sortOrder === 'terbaru'
                  ? 'Tanggal Pengajuan (Terbaru)'
                  : 'Tanggal Pengajuan (Terlama)'}
              </strong>

            </button>

          </div>

        </section>

        {/* TABLE */}

        <section className="mapres-table-card">

          <div className="mapres-table-wrapper">

            <table className="mapres-table">

              <thead>
                <tr>
                  <th>MAHASISWA</th>
                  <th>NIM</th>
                  <th>ANGKATAN</th>
                  <th>KELENGKAPAN</th>
                  <th>STATUS PENGAJUAN</th>
                  <th>TANGGAL PENGAJUAN</th>
                  <th>AKSI</th>
                </tr>
              </thead>

              <tbody>

                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map(
                    (student) => (
                      <tr key={student.nim}>

                        <td>

                          <div className="mapres-student">

                            <div className="student-avatar">
                              {student.initials}
                            </div>

                            <div className="student-info">

                              <strong>
                                {student.name}
                              </strong>

                              <span>
                                {student.prodi}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          {student.nim}
                        </td>

                        <td>
                          <strong>
                            {student.angkatan}
                          </strong>
                        </td>

                        <td>

                          <span
                            className={`completeness-pill ${student.completenessType}`}
                          >
                            {student.kelengkapan}
                          </span>

                        </td>

                        <td>

                          <span
                            className={`mapres-status ${student.statusType}`}
                          >

                            <span className="status-symbol">

                              {student.statusType ===
                              'approved'
                                ? '✓'
                                : student.statusType ===
                                    'revision'
                                  ? '↻'
                                  : student.statusType ===
                                      'rejected'
                                    ? '×'
                                    : student.statusType ===
                                        'waiting'
                                      ? '⌛'
                                      : '●'}

                            </span>

                            {student.status}

                          </span>

                        </td>

                        <td>
                          {student.tanggal}
                        </td>

                        <td>

                          <button
                            type="button"
                            className={`mapres-action ${student.actionType}`}
                            onClick={() => {
                              if (student.action === 'Verifikasi Pengajuan') {
                                navigate(
                                  `/superadmin/daftar-mapres/${student.nim}/verifikasi`
                                )
                              }

                              if (student.action === 'Lihat Detail') {
                                navigate(
                                  `/superadmin/daftar-mapres/${student.nim}/detail`
                                )
                              }

                              if (student.action === 'Tinjau Revisi') {
                                navigate(
                                  `/superadmin/daftar-mapres/${student.nim}/revisi`
                                )
                              }
                            }}

                            >   
                              {student.action}

                              {student.actionType === 'primary' && (
                                <span> →</span>
                              )}
                            </button>

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="7"
                      className="empty-mapres"
                    >
                      Tidak ada pengajuan yang
                      sesuai dengan filter.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* FOOTER TABLE */}

          <div className="mapres-table-footer">

            <p>
              Menampilkan{' '}
              <strong>
                {filteredStudents.length === 0
                  ? '0'
                  : `${startIndex + 1}–${endIndex}`}
              </strong>{' '}
              dari{' '}
              <strong>
                {filteredStudents.length}
              </strong>{' '}
              data yang sesuai
            </p>

            {totalPages > 1 && (
              <div className="pagination">

                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                >
                  Sebelumnya
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((number) => (
                  <button
                    type="button"
                    key={number}
                    className={
                      page === number
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      setPage(number)
                    }
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(
                        totalPages,
                        prev + 1
                      )
                    )
                  }
                >
                  Selanjutnya
                </button>

              </div>
            )}

          </div>

        </section>

        {/* INFORMATION */}

        <section className="mapres-information">

          <div className="information-icon">
            i
          </div>

          <div className="information-copy">

            <strong>
              INFORMASI SELEKSI TAHAP 1
            </strong>

            <p>
              Hanya pengajuan berstatus{' '}
              <b>Disetujui</b> yang akan
              diproses ke pemeringkatan
              Tahap 1. Tiga mahasiswa dengan
              nilai capaian tertinggi dari
              setiap angkatan (2024, 2025,
              2026) akan lolos ke asesmen
              karakter <b>Pradita Value</b>.
            </p>

          </div>

        </section>

      </main>

      <footer className="mapres-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa
        Berprestasi Universitas.
      </footer>

    </div>
  )
}

export default DaftarMapres