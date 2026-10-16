import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SuperadminNavbar from '../components/SuperadminNavbar'
import SuperadminHeader from '../components/SuperadminHeader'

import './PraditaValue.css'
import {
  FinalistIcon,
  WaitingDataIcon,
  MailSentIcon,
  ApprovedIcon,
} from '../components/SummaryIcons'

const finalists = [
  // =========================
  // ANGKATAN 2024
  // =========================
  {
    id: 1,
    rank: 1,
    initials: 'SN',
    name: 'Siti Nurhaliza',
    nim: '13521012',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    tahap1: 91.25,

    peers: 3,
    lecturers: 2,
    formsSent: 5,
    responses: 5,

    status: 'Selesai',
    statusType: 'completed',
  },
  {
    id: 2,
    rank: 2,
    initials: 'RF',
    name: 'Reza Firmansyah',
    nim: '13520011',
    prodi: 'S1 Teknik Industri',
    angkatan: '2024',
    tahap1: 88.5,

    peers: 3,
    lecturers: 2,
    formsSent: 5,
    responses: 3,

    status: 'Penilaian Berlangsung',
    statusType: 'progress',
  },
  {
    id: 3,
    rank: 3,
    initials: 'DA',
    name: 'Dinda Amelia',
    nim: '13520037',
    prodi: 'S1 Manajemen Bisnis',
    angkatan: '2024',
    tahap1: 86.75,

    peers: 3,
    lecturers: 2,
    formsSent: 0,
    responses: 0,

    status: 'Siap Dikirim',
    statusType: 'ready',
  },

  // =========================
  // ANGKATAN 2025
  // =========================
  {
    id: 4,
    rank: 1,
    initials: 'AP',
    name: 'Amanda Putri',
    nim: '13521089',
    prodi: 'S1 Informatika',
    angkatan: '2025',
    tahap1: 90.75,

    peers: 3,
    lecturers: 2,
    formsSent: 5,
    responses: 5,

    status: 'Selesai',
    statusType: 'completed',
  },
  {
    id: 5,
    rank: 2,
    initials: 'AR',
    name: 'Ahmad Rizky Pratama',
    nim: '13521048',
    prodi: 'S1 Informatika',
    angkatan: '2025',
    tahap1: 87.5,

    peers: 3,
    lecturers: 2,
    formsSent: 5,
    responses: 2,

    status: 'Penilaian Berlangsung',
    statusType: 'progress',
  },
  {
    id: 6,
    rank: 3,
    initials: 'BA',
    name: 'Bagas Aditya Rahman',
    nim: '13521066',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    tahap1: 85.85,

    peers: 0,
    lecturers: 2,
    formsSent: 0,
    responses: 0,

    status: 'Menunggu Data Rekan Sejawat',
    statusType: 'waiting',
  },

  // =========================
  // ANGKATAN 2026
  // =========================
  {
    id: 7,
    rank: 1,
    initials: 'KJ',
    name: 'Kevin Jonathan',
    nim: '13522005',
    prodi: 'S1 Desain Komunikasi Visual',
    angkatan: '2026',
    tahap1: 84.75,

    peers: 3,
    lecturers: 2,
    formsSent: 5,
    responses: 4,

    status: 'Penilaian Berlangsung',
    statusType: 'progress',
  },
  {
    id: 8,
    rank: 2,
    initials: 'MF',
    name: 'Muhammad Farhan',
    nim: '13522033',
    prodi: 'S1 Teknik Industri',
    angkatan: '2026',
    tahap1: 83.9,

    peers: 3,
    lecturers: 2,
    formsSent: 0,
    responses: 0,

    status: 'Siap Dikirim',
    statusType: 'ready',
  },
  {
    id: 9,
    rank: 3,
    initials: 'NF',
    name: 'Nadia Fitri',
    nim: '13522047',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    tahap1: 82.75,

    peers: 0,
    lecturers: 2,
    formsSent: 0,
    responses: 0,

    status: 'Menunggu Data Rekan Sejawat',
    statusType: 'waiting',
  },
]

function PraditaValue() {
  const navigate = useNavigate()

  const [selectedYear, setSelectedYear] = useState('2024')

  const filteredFinalists = useMemo(() => {
    return finalists.filter(
      (student) => student.angkatan === selectedYear
    )
  }, [selectedYear])

  const summary = {
    total: finalists.length,

    waiting: finalists.filter(
      (student) => student.statusType === 'waiting'
    ).length,

    sent: finalists.filter(
      (student) =>
        student.statusType === 'progress' ||
        student.statusType === 'completed'
    ).length,

    completed: finalists.filter(
      (student) => student.statusType === 'completed'
    ).length,
  }

  const getActionLabel = (student) => {
    if (student.statusType === 'waiting') {
      return 'Lihat Status'
    }

    if (student.statusType === 'ready') {
      return 'Kelola Penilai'
    }

    if (student.statusType === 'progress') {
      return 'Monitor'
    }

    return 'Lihat Hasil'
  }

  const handleAction = (student) => {
    navigate(`/superadmin/pradita-value/${student.nim}`)
  }

  return (
    <div className="pradita-page">

      <div className="admin-top-section">

        <SuperadminNavbar />

        <SuperadminHeader
          title="Pradita Value"
          description="Kelola proses penilaian finalis melalui dosen dan rekan sejawat."
          metaStage="Tahap 2 Pradita Value"
          metaInfo="5 penilai untuk setiap finalis"
        />

      </div>

      <main className="pradita-content">

        {/* =========================
            SUMMARY
        ========================= */}

        <section className="pradita-summary-grid">

              <SummaryCard
                title="Total Finalis"
                value={summary.total}
                description="3 finalis per angkatan"
                icon={<FinalistIcon />}
              />

              <SummaryCard
                title="Menunggu Data"
                value={summary.waiting}
                description="Data rekan sejawat belum lengkap"
                icon={<WaitingDataIcon />}
              />

              <SummaryCard
                title="Form Terkirim"
                value={summary.sent}
                description="Asesmen telah dikirim ke penilai"
                icon={<MailSentIcon />}
              />

              <SummaryCard
                title="Penilaian Lengkap"
                value={summary.completed}
                description="Seluruh penilai telah merespons"
                icon={<ApprovedIcon />}
              />

            </section>

        {/* =========================
            SECTION HEADER
        ========================= */}

        <section className="pradita-list-section">

          <div className="pradita-list-heading">

            <div>
              <h2>
                Finalis Pradita Value
              </h2>

              <p>
                Tiga mahasiswa dengan nilai Tahap 1 tertinggi
                dari setiap angkatan.
              </p>
            </div>

            <div className="pradita-total-badge">
              9 Finalis
            </div>

          </div>

          {/* =========================
              YEAR TABS
          ========================= */}

          <div className="pradita-tabs">

            {['2024', '2025', '2026'].map((year) => (
              <button
                type="button"
                key={year}
                className={
                  selectedYear === year
                    ? 'pradita-tab active'
                    : 'pradita-tab'
                }
                onClick={() => setSelectedYear(year)}
              >
                Angkatan {year}
              </button>
            ))}

          </div>

          {/* =========================
              TABLE
          ========================= */}

          <div className="pradita-table-card">

            <div className="pradita-table-wrapper">

              <table className="pradita-table">

                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>MAHASISWA</th>
                    <th>NILAI TAHAP 1</th>
                    <th>REKAN SEJAWAT</th>
                    <th>DOSEN PENILAI</th>
                    <th>FORM TERKIRIM</th>
                    <th>RESPON</th>
                    <th>STATUS</th>
                    <th>AKSI</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredFinalists.map((student) => (
                    <tr key={student.id}>

                      <td>
                        <div className="pradita-rank">
                          {student.rank}
                        </div>
                      </td>

                      <td>
                        <div className="pradita-student">

                          <div className="pradita-avatar">
                            {student.initials}
                          </div>

                          <div className="pradita-student-copy">

                            <strong>
                              {student.name}
                            </strong>

                            <span>
                              {student.nim}
                            </span>

                            <small>
                              {student.prodi}
                            </small>

                          </div>

                        </div>
                      </td>

                      <td>
                        <strong className="stage-one-score">
                          {student.tahap1.toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <ProgressCount
                          value={student.peers}
                          total={3}
                        />
                      </td>

                      <td>
                        <ProgressCount
                          value={student.lecturers}
                          total={2}
                        />
                      </td>

                      <td>
                        <ProgressCount
                          value={student.formsSent}
                          total={5}
                        />
                      </td>

                      <td>
                        <ProgressCount
                          value={student.responses}
                          total={5}
                          success={
                            student.responses === 5
                          }
                        />
                      </td>

                      <td>
                        <span
                          className={`pradita-status ${student.statusType}`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`pradita-action ${student.statusType}`}
                          onClick={() =>
                            handleAction(student)
                          }
                        >
                          {getActionLabel(student)}
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

        {/* =========================
            INFORMATION
        ========================= */}

        <section className="pradita-information">

          <div className="pradita-information-icon">
            i
          </div>

          <div>

            <strong>
              INFORMASI ASESMEN PRADITA VALUE
            </strong>

            <p>
              Setiap finalis dinilai oleh 3 rekan sejawat dan
              2 dosen. Dosen penilai terdiri dari Kaprodi dan
              satu dosen yang dipilih secara otomatis oleh sistem.
              Setiap penilai menerima token unik yang hanya dapat
              digunakan satu kali untuk mengirim penilaian.
            </p>

          </div>

        </section>

      </main>

      <footer className="pradita-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa Berprestasi Universitas.
      </footer>

    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="pradita-summary-card">

      <div className="pradita-summary-copy">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {description}
        </p>

      </div>

      <div className="pradita-summary-icon">
        {icon}
      </div>

    </div>
  )
}

function ProgressCount({
  value,
  total,
  success = false,
}) {
  const complete = value === total

  return (
    <div
      className={
        success || complete
          ? 'progress-count complete'
          : value > 0
            ? 'progress-count partial'
            : 'progress-count empty'
      }
    >
      <strong>
        {value}/{total}
      </strong>
    </div>
  )
}

export default PraditaValue