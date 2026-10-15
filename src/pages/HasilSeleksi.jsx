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


/* =========================
   9 FINALIS TAHAP 2
========================= */

const finalistData = [
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
    initials: 'NP',
    name: 'Nadia Putri',
    nim: '13522052',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    tahap1: 82.75,
    praditaValue: 86.4,
    finalScore: 84.58,
    status: 'Peringkat 3',
    statusType: 'ranked',
  },
]


/* =========================
   PESERTA LAIN TAHAP 1
   Prototype frontend
========================= */

const years = ['2024', '2025', '2026']

const otherStudents = Array.from(
  { length: 31 },
  (_, index) => {
    const number = index + 10

    return {
      id: 100 + index,
      initials: `M${number}`,
      name: `Mahasiswa ${number}`,
      nim: `2410102${String(number).padStart(3, '0')}`,
      prodi: 'S1 Sistem Informasi',
      angkatan: years[index % years.length],

      tahap1: Number(
        (82.4 - index * 0.55).toFixed(2)
      ),

      praditaValue: null,
      finalScore: null,
    }
  }
)


function HasilSeleksi() {
  const [selectedYear, setSelectedYear] =
    useState('2024')


  /* =========================
     DATA YANG DITAMPILKAN
  ========================= */

  const displayedResults = useMemo(() => {

    /* SEMUA ANGKATAN */

    if (selectedYear === 'all') {
      const finalists = [...finalistData]
        .sort(
          (a, b) =>
            b.finalScore - a.finalScore
        )

      const remainingStudents =
        [...otherStudents].sort(
          (a, b) =>
            b.tahap1 - a.tahap1
        )

      return [
        ...finalists,
        ...remainingStudents,
      ].map((student, index) => ({
        ...student,
        displayRank: index + 1,
      }))
    }


    /* PER ANGKATAN */

    return finalistData
      .filter(
        (student) =>
          student.angkatan === selectedYear
      )
      .sort(
        (a, b) =>
          a.rank - b.rank
      )
      .map((student) => ({
        ...student,
        displayRank: student.rank,
      }))

  }, [selectedYear])


  const winner = displayedResults[0]


  return (
    <div className="hasil-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-top-section">

        <Navbar />

        <AdminHeader
          title="Hasil Seleksi"
          description="Lihat hasil akhir dan peringkat Mahasiswa Berprestasi per angkatan maupun secara keseluruhan."
          metaStage="Seleksi Selesai"
          metaInfo="Peringkat per angkatan & seluruh peserta"
        />

      </div>


      <main className="hasil-content">

        {/* =========================
            SUMMARY
        ========================= */}

        <section className="hasil-summary-grid">

          <SummaryCard
            title="Total Peserta"
            value="40"
            description="Seluruh peserta seleksi"
            icon={<FinalistIcon />}
          />

          <SummaryCard
            title="Angkatan"
            value="3"
            description="2024, 2025, dan 2026"
            icon={<CohortIcon />}
          />

          <SummaryCard
            title="Finalis Tahap 2"
            value="9"
            description="3 finalis setiap angkatan"
            icon={<ApprovedIcon />}
          />

          <SummaryCard
            title="Pemenang"
            value="3"
            description="Juara 1 setiap angkatan"
            icon={<WinnerIcon />}
          />

        </section>


        {/* =========================
            RANKING
        ========================= */}

        <section className="hasil-ranking-section">

          <div className="hasil-section-heading">

            <div>

              <h2>
                Peringkat Akhir
              </h2>

              <p>
                Peringkat mahasiswa berdasarkan hasil
                seleksi per angkatan dan seluruh peserta.
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

            {[
              {
                value: '2024',
                label: 'Angkatan 2024',
              },
              {
                value: '2025',
                label: 'Angkatan 2025',
              },
              {
                value: '2026',
                label: 'Angkatan 2026',
              },
              {
                value: 'all',
                label: 'Semua Angkatan',
              },
            ].map((tab) => (

              <button
                key={tab.value}
                type="button"
                className={
                  selectedYear === tab.value
                    ? 'hasil-tab active'
                    : 'hasil-tab'
                }
                onClick={() =>
                  setSelectedYear(tab.value)
                }
              >
                {tab.label}
              </button>

            ))}

          </div>


          {/* =========================
              WINNER
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
                    {selectedYear === 'all'
                      ? 'PERINGKAT 1 SEMUA ANGKATAN'
                      : `JUARA 1 ANGKATAN ${selectedYear}`}
                  </span>


                  <h3>
                    {winner.name}
                  </h3>


                  <p>
                    {winner.nim}
                    {' • '}
                    {winner.prodi}

                    {selectedYear === 'all' && (
                      <>
                        {' • '}
                        Angkatan {winner.angkatan}
                      </>
                    )}
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

                  <th>
                    PERINGKAT
                  </th>

                  <th>
                    MAHASISWA
                  </th>


                  {selectedYear === 'all' && (
                    <th>
                      ANGKATAN
                    </th>
                  )}


                  <th>
                    NILAI TAHAP 1
                  </th>

                  <th>
                    PRADITA VALUE
                  </th>

                  <th>
                    NILAI AKHIR
                  </th>


                  {selectedYear !== 'all' && (
                    <th>
                      HASIL
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {displayedResults.map(
                  (student) => (

                    <tr key={student.id}>

                      {/* RANK */}

                      <td>

                        <div
                          className={`hasil-rank ${
                            student.displayRank <= 3
                              ? `rank-${student.displayRank}`
                              : ''
                          }`}
                        >
                          {student.displayRank}
                        </div>

                      </td>


                      {/* STUDENT */}

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


                      {/* ANGKATAN */}

                      {selectedYear === 'all' && (
                        <td>
                          <strong>
                            {student.angkatan}
                          </strong>
                        </td>
                      )}


                      {/* TAHAP 1 */}

                      <td>

                        <span className="hasil-score">
                          {student.tahap1.toFixed(2)}
                        </span>

                      </td>


                      {/* PRADITA VALUE */}

                      <td>

                        <span className="hasil-score">
                          {student.praditaValue !== null
                            ? student.praditaValue.toFixed(2)
                            : '—'}
                        </span>

                      </td>


                      {/* FINAL SCORE */}

                      <td>

                        {student.finalScore !== null ? (

                          <strong className="hasil-final-score">
                            {student.finalScore.toFixed(2)}
                          </strong>

                        ) : (

                          <span className="hasil-score">
                            —
                          </span>

                        )}

                      </td>


                      {/* HASIL PER ANGKATAN */}

                      {selectedYear !== 'all' && (

                        <td>

                          <span
                            className={`hasil-status ${student.statusType}`}
                          >
                            {student.status}
                          </span>

                        </td>

                      )}

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
              Peringkat per angkatan menampilkan tiga
              finalis dari setiap angkatan. Pada tab
              Semua Angkatan, seluruh peserta ditampilkan
              dalam satu urutan peringkat tanpa pemisahan
              status seleksi.
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


/* =========================
   SUMMARY CARD
========================= */

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