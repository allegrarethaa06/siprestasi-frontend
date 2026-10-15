import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import {
  FinalistIcon,
  CohortIcon,
  WinnerIcon,
} from '../components/SummaryIcons'

import './PeringkatTahap1.css'


/* =========================
   TOP 3 PER ANGKATAN
========================= */

const topStudents = [
  {
    id: 1,
    name: 'Siti Nurhaliza',
    initials: 'SN',
    nim: '13521012',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    score: 91.25,
  },
  {
    id: 2,
    name: 'Reza Firmansyah',
    initials: 'RF',
    nim: '13520011',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    score: 88.5,
  },
  {
    id: 3,
    name: 'Dinda Maharani',
    initials: 'DM',
    nim: '13520037',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    score: 86.75,
  },

  {
    id: 4,
    name: 'Amanda Putri',
    initials: 'AP',
    nim: '13521089',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    score: 90.75,
  },
  {
    id: 5,
    name: 'Ahmad Rizky Pratama',
    initials: 'AR',
    nim: '13521048',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    score: 87.5,
  },
  {
    id: 6,
    name: 'Bagas Aditya Rahman',
    initials: 'BA',
    nim: '13521066',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    score: 85.85,
  },

  {
    id: 7,
    name: 'Kevin Jonathan',
    initials: 'KJ',
    nim: '13522005',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    score: 84.75,
  },
  {
    id: 8,
    name: 'Muhammad Farhan',
    initials: 'MF',
    nim: '13522033',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    score: 83.9,
  },
  {
    id: 9,
    name: 'Nadia Putri',
    initials: 'NP',
    nim: '13522052',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    score: 82.75,
  },
]


/* =========================
   PESERTA LAIN
   Prototype frontend
========================= */

const otherStudents = [
  ...Array.from({ length: 11 }, (_, index) => ({
    id: 100 + index,
    name: `Mahasiswa 2024-${index + 4}`,
    initials: `M${index + 4}`,
    nim: `24101024${String(index + 4).padStart(2, '0')}`,
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    score: Number(
      (86.4 - index * 0.7).toFixed(2)
    ),
  })),

  ...Array.from({ length: 10 }, (_, index) => ({
    id: 200 + index,
    name: `Mahasiswa 2025-${index + 4}`,
    initials: `M${index + 14}`,
    nim: `24101025${String(index + 4).padStart(2, '0')}`,
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    score: Number(
      (85.5 - index * 0.72).toFixed(2)
    ),
  })),

  ...Array.from({ length: 10 }, (_, index) => ({
    id: 300 + index,
    name: `Mahasiswa 2026-${index + 4}`,
    initials: `M${index + 24}`,
    nim: `24101026${String(index + 4).padStart(2, '0')}`,
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    score: Number(
      (82.4 - index * 0.68).toFixed(2)
    ),
  })),
]


const allStudents = [
  ...topStudents,
  ...otherStudents,
]


function PeringkatTahap1() {
  const navigate = useNavigate()

  const [selectedAngkatan, setSelectedAngkatan] =
    useState('2024')


  /* =========================
     RANKING
  ========================= */

  const currentRanking = useMemo(() => {

    /* SEMUA ANGKATAN */

    if (selectedAngkatan === 'all') {
      return [...allStudents]
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .map((student, index) => ({
          ...student,
          displayRank: index + 1,
        }))
    }


    /* PER ANGKATAN
       Tetap Top 3
    */

    return topStudents
      .filter(
        (student) =>
          student.angkatan === selectedAngkatan
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .map((student, index) => ({
        ...student,
        displayRank: index + 1,
      }))

  }, [selectedAngkatan])


  return (
    <div className="ranking-page">

      {/* NAVBAR */}

      <Navbar variant="light" />


      <main className="ranking-content">

        {/* BACK */}

        <button
          type="button"
          className="ranking-back-button"
          onClick={() =>
            navigate('/admin/daftar-mapres')
          }
        >
          <span>←</span>
          Kembali ke Daftar Mapres
        </button>


        {/* PAGE TITLE */}

        <div className="ranking-page-heading">

          <h1>
            Peringkat Tahap 1
          </h1>

          <p>
            Lihat peringkat sementara seleksi Tahap 1
            berdasarkan angkatan maupun seluruh peserta.
          </p>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <section className="ranking-summary-grid">

          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">

              <span>
                Total Peserta
              </span>

              <strong>
                40
              </strong>

              <p>
                Seluruh mahasiswa peserta seleksi
              </p>

            </div>


            <div className="ranking-summary-icon">
              <FinalistIcon />
            </div>

          </div>


          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">

              <span>
                Angkatan
              </span>

              <strong>
                3
              </strong>

              <p>
                2024, 2025, dan 2026
              </p>

            </div>


            <div className="ranking-summary-icon">
              <CohortIcon />
            </div>

          </div>


          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">

              <span>
                Finalis Tahap 2
              </span>

              <strong>
                9
              </strong>

              <p>
                Top 3 dari setiap angkatan
              </p>

            </div>


            <div className="ranking-summary-icon">
              <WinnerIcon />
            </div>

          </div>

        </section>


        {/* =========================
            RANKING
        ========================= */}

        <section className="ranking-section">

          <div className="ranking-section-header">

            <div>

              <h2>
                Peringkat Mahasiswa
              </h2>

              <p>
                {selectedAngkatan === 'all'
                  ? 'Peringkat seluruh peserta berdasarkan Nilai Tahap 1.'
                  : 'Kandidat Top 3 berdasarkan Nilai Tahap 1 dari setiap angkatan.'}
              </p>

            </div>


            <span className="ranking-total-badge">

              {selectedAngkatan === 'all'
                ? '40 Peserta'
                : '3 Finalis'}

            </span>

          </div>


          {/* =========================
              TABS
          ========================= */}

          <div className="ranking-tabs">

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
                  selectedAngkatan === tab.value
                    ? 'ranking-tab active'
                    : 'ranking-tab'
                }
                onClick={() =>
                  setSelectedAngkatan(tab.value)
                }
              >
                {tab.label}
              </button>

            ))}

          </div>


          {/* =========================
              TABLE
          ========================= */}

          <div className="ranking-table-wrapper">

            <table className="ranking-table">

              <thead>

                <tr>

                  <th>
                    PERINGKAT
                  </th>

                  <th>
                    MAHASISWA
                  </th>

                  <th>
                    NIM
                  </th>


                  {selectedAngkatan === 'all' && (
                    <th>
                      ANGKATAN
                    </th>
                  )}


                  <th>
                    PROGRAM STUDI
                  </th>

                  <th>
                    NILAI TAHAP 1
                  </th>


                  {selectedAngkatan !== 'all' && (
                    <th>
                      STATUS
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {currentRanking.map((student) => (

                  <tr key={student.id}>

                    {/* RANK */}

                    <td>

                      <div
                        className={`ranking-position ${
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

                      <div className="ranking-student">

                        <div className="ranking-avatar">
                          {student.initials}
                        </div>


                        <div className="ranking-student-info">

                          <strong>
                            {student.name}
                          </strong>


                          {selectedAngkatan !== 'all' && (
                            <span>
                              Angkatan {student.angkatan}
                            </span>
                          )}

                        </div>

                      </div>

                    </td>


                    {/* NIM */}

                    <td>
                      {student.nim}
                    </td>


                    {/* ANGKATAN */}

                    {selectedAngkatan === 'all' && (
                      <td>
                        <strong>
                          {student.angkatan}
                        </strong>
                      </td>
                    )}


                    {/* PRODI */}

                    <td>
                      {student.prodi}
                    </td>


                    {/* SCORE */}

                    <td>

                      <strong className="ranking-score">
                        {student.score
                          .toFixed(2)
                          .replace('.', ',')}
                      </strong>

                    </td>


                    {/* STATUS */}

                    {selectedAngkatan !== 'all' && (

                      <td>

                        <span className="ranking-status">
                          Kandidat Top 3
                        </span>

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* =========================
              INFO
          ========================= */}

          <div className="ranking-info">

            <div className="ranking-info-icon">
              ✓
            </div>


            <div>

              <strong>
                Peringkat Sementara
              </strong>


              <p>

                {selectedAngkatan === 'all'
                  ? 'Tab Semua Angkatan menampilkan seluruh peserta dalam satu urutan berdasarkan Nilai Tahap 1 tertinggi.'
                  : 'Peringkat dapat berubah selama periode seleksi masih berlangsung. Tiga mahasiswa dengan nilai tertinggi dari setiap angkatan akan melanjutkan ke Pradita Value.'}

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}


export default PeringkatTahap1