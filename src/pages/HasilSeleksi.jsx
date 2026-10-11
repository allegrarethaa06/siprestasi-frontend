import { useMemo, useState } from 'react'

import Navbar from '../components/Navbar'
import AdminHeader from '../components/AdminHeader'

import './HasilSeleksi.css'
import {
  FinalistIcon,
  CohortIcon,
  ApprovedIcon,
  WinnerIcon,
} from '../components/SummaryIcons'

const resultData = [
  // =========================
  // 2024
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
    praditaValue: 89.2,
    finalScore: 90.23,

    status: 'Juara 1',
    statusType: 'winner',
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
    praditaValue: 87.4,
    finalScore: 87.95,

    status: 'Peringkat 2',
    statusType: 'ranked',
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
    praditaValue: 86.1,
    finalScore: 86.43,

    status: 'Peringkat 3',
    statusType: 'ranked',
  },

  // =========================
  // 2025
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
    praditaValue: 91.0,
    finalScore: 90.88,

    status: 'Juara 1',
    statusType: 'winner',
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
    praditaValue: 88.25,
    finalScore: 87.88,

    status: 'Peringkat 2',
    statusType: 'ranked',
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
    praditaValue: 85.5,
    finalScore: 85.68,

    status: 'Peringkat 3',
    statusType: 'ranked',
  },

  // =========================
  // 2026
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
    praditaValue: 90.1,
    finalScore: 87.43,

    status: 'Juara 1',
    statusType: 'winner',
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
    praditaValue: 88.2,
    finalScore: 86.05,

    status: 'Peringkat 2',
    statusType: 'ranked',
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
    praditaValue: 86.4,
    finalScore: 84.58,

    status: 'Peringkat 3',
    statusType: 'ranked',
  },
]

function HasilSeleksi() {
  const [selectedYear, setSelectedYear] = useState('2024')

  const filteredResults = useMemo(() => {
    return resultData
      .filter(
        (student) =>
          student.angkatan === selectedYear
      )
      .sort(
        (a, b) =>
          a.rank - b.rank
      )
  }, [selectedYear])

  const winner = filteredResults.find(
    (student) => student.rank === 1
  )

  return (
    <div className="hasil-page">

      <div className="admin-top-section">

        <Navbar />

        <AdminHeader
          title="Hasil Seleksi"
          description="Lihat hasil akhir dan peringkat Mahasiswa Berprestasi dari setiap angkatan."
          metaStage="Seleksi Selesai"
          metaInfo="Peringkat akhir per angkatan"
        />

      </div>

      <main className="hasil-content">

        {/* =========================
            SUMMARY
        ========================= */}

        <section className="hasil-summary-grid">

            <SummaryCard
              title="Total Finalis"
              value="9"
              description="3 finalis dari setiap angkatan"
              icon={<FinalistIcon />}
            />

            <SummaryCard
              title="Angkatan"
              value="3"
              description="2024, 2025, dan 2026"
              icon={<CohortIcon />}
            />

            <SummaryCard
              title="Penilaian Lengkap"
              value="9"
              description="Tahap 1 dan Pradita Value selesai"
              icon={<ApprovedIcon />}
            />

            <SummaryCard
              title="Pemenang"
              value="3"
              description="Juara 1 dari setiap angkatan"
              icon={<WinnerIcon />}
            />

          </section>

        {/* =========================
            SECTION TITLE
        ========================= */}

        <section className="hasil-ranking-section">

          <div className="hasil-section-heading">

            <div>
              <h2>
                Peringkat Akhir
              </h2>

              <p>
                Hasil akhir tiga finalis Mahasiswa
                Berprestasi dari setiap angkatan.
              </p>
            </div>

            <span className="hasil-period-badge">
              Periode 2026
            </span>

          </div>

          {/* =========================
              TABS
          ========================= */}

          <div className="hasil-tabs">

            {['2024', '2025', '2026'].map(
              (year) => (
                <button
                  key={year}
                  type="button"
                  className={
                    selectedYear === year
                      ? 'hasil-tab active'
                      : 'hasil-tab'
                  }
                  onClick={() =>
                    setSelectedYear(year)
                  }
                >
                  Angkatan {year}
                </button>
              )
            )}

          </div>

          {/* =========================
              WINNER CARD
          ========================= */}

          {winner && (
            <section className="winner-card">

              <div className="winner-left">

                <div className="winner-rank">
                  ★
                </div>

                <div className="winner-avatar">
                  {winner.initials}
                </div>

                <div className="winner-copy">

                  <span>
                    JUARA 1 ANGKATAN {selectedYear}
                  </span>

                  <h3>
                    {winner.name}
                  </h3>

                  <p>
                    {winner.nim}
                    {' • '}
                    {winner.prodi}
                  </p>

                </div>

              </div>

              <div className="winner-score">

                <span>
                  Nilai Akhir
                </span>

                <strong>
                  {winner.finalScore.toFixed(2)}
                </strong>

              </div>

            </section>
          )}

          {/* =========================
              TABLE
          ========================= */}

          <div className="hasil-table-card">

            <table className="hasil-table">

              <thead>
                <tr>
                  <th>PERINGKAT</th>
                  <th>MAHASISWA</th>
                  <th>NILAI TAHAP 1</th>
                  <th>PRADITA VALUE</th>
                  <th>NILAI AKHIR</th>
                  <th>HASIL</th>
                </tr>
              </thead>

              <tbody>

                {filteredResults.map(
                  (student) => (
                    <tr key={student.id}>

                      <td>
                        <div
                          className={`hasil-rank rank-${student.rank}`}
                        >
                          {student.rank}
                        </div>
                      </td>

                      <td>

                        <div className="hasil-student">

                          <div className="hasil-avatar">
                            {student.initials}
                          </div>

                          <div>

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
                        <span className="hasil-score">
                          {student.tahap1.toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <span className="hasil-score">
                          {student.praditaValue.toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <strong className="hasil-final-score">
                          {student.finalScore.toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`hasil-status ${student.statusType}`}
                        >
                          {student.status}
                        </span>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =========================
            INFORMATION
        ========================= */}

        <section className="hasil-information">

          <div className="hasil-info-icon">
            i
          </div>

          <div>

            <strong>
              INFORMASI HASIL SELEKSI
            </strong>

            <p>
              Peringkat akhir ditentukan setelah
              seluruh proses Tahap 1 dan asesmen
              Pradita Value selesai. Nilai pada
              halaman ini masih menggunakan data
              simulasi frontend dan akan disesuaikan
              dengan rumus penilaian resmi sistem.
            </p>

          </div>

        </section>

      </main>

      <footer className="hasil-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa
        Berprestasi Universitas.
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
    <div className="hasil-summary-card">

      <div className="hasil-summary-copy">

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

      <div className="hasil-summary-icon">
        {icon}
      </div>

    </div>
  )
}

export default HasilSeleksi