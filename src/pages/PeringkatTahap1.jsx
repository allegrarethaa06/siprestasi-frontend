import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'

import {
  FinalistIcon,
  CohortIcon,
  WinnerIcon,
} from '../components/SummaryIcons'

import './PeringkatTahap1.css'


function PeringkatTahap1() {
  const navigate = useNavigate()

  const [selectedAngkatan, setSelectedAngkatan] = useState('2024')


  /* =========================
      DATA RANKING
  ========================= */

  const rankingData = {
    2024: [
      {
        rank: 1,
        name: 'Siti Nurhaliza',
        initials: 'SN',
        nim: '13521012',
        prodi: 'S1 Sistem Informasi',
        score: '91,25',
      },
      {
        rank: 2,
        name: 'Reza Firmansyah',
        initials: 'RF',
        nim: '13520011',
        prodi: 'S1 Teknik Industri',
        score: '88,50',
      },
      {
        rank: 3,
        name: 'Dinda Maharani',
        initials: 'DM',
        nim: '13520037',
        prodi: 'S1 Informatika',
        score: '86,75',
      },
    ],

    2025: [
      {
        rank: 1,
        name: 'Amanda Putri',
        initials: 'AP',
        nim: '13521089',
        prodi: 'S1 Informatika',
        score: '90,75',
      },
      {
        rank: 2,
        name: 'Ahmad Rizky Pratama',
        initials: 'AR',
        nim: '13521048',
        prodi: 'S1 Informatika',
        score: '87,50',
      },
      {
        rank: 3,
        name: 'Bagas Aditya Rahman',
        initials: 'BA',
        nim: '13521066',
        prodi: 'S1 Sistem Informasi',
        score: '85,85',
      },
    ],

    2026: [
      {
        rank: 1,
        name: 'Kevin Jonathan',
        initials: 'KJ',
        nim: '13522005',
        prodi: 'S1 DKV',
        score: '84,75',
      },
      {
        rank: 2,
        name: 'Muhammad Farhan',
        initials: 'MF',
        nim: '13522033',
        prodi: 'S1 Teknik Industri',
        score: '83,90',
      },
      {
        rank: 3,
        name: 'Nadia Putri',
        initials: 'NP',
        nim: '13522052',
        prodi: 'S1 Sistem Informasi',
        score: '82,75',
      },
    ],
  }


  const currentRanking = rankingData[selectedAngkatan]


  return (
    <div className="ranking-page">

      {/* NAVBAR */}
      <Navbar variant="light" />


      <main className="ranking-content">

        {/* BACK */}
        <button
          type="button"
          className="ranking-back-button"
          onClick={() => navigate('/admin/daftar-mapres')}
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
            <p>
                Lihat peringkat sementara seleksi Tahap 1 berdasarkan angkatan.
            </p>
          </p>

        </div>


        {/* SUMMARY */}
        <section className="ranking-summary-grid">

          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">
              <span>Finalis Tahap 1</span>

              <strong>9</strong>

              <p>Total mahasiswa yang lolos</p>
            </div>

            <div className="ranking-summary-icon">
              <FinalistIcon />
            </div>

          </div>


          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">
              <span>Angkatan</span>

              <strong>3</strong>

              <p>2024, 2025, dan 2026</p>
            </div>

            <div className="ranking-summary-icon">
              <CohortIcon />
            </div>

          </div>


          <div className="ranking-summary-card">

            <div className="ranking-summary-copy">
              <span>Top per Angkatan</span>

              <strong>3</strong>

              <p>Finalis dari setiap angkatan</p>
            </div>

            <div className="ranking-summary-icon">
              <WinnerIcon />
            </div>

          </div>

        </section>


        {/* RANKING */}
        <section className="ranking-section">

          <div className="ranking-section-header">

            <div>
              <h2>Peringkat Mahasiswa</h2>

              <p>
                <p>
                    Kandidat Top 3 berdasarkan nilai Tahap 1 saat ini dari setiap angkatan.
                </p>
              </p>
            </div>

            <span className="ranking-total-badge">
              9 Finalis
            </span>

          </div>


          {/* ANGKATAN */}
          <div className="ranking-tabs">

            {['2024', '2025', '2026'].map((angkatan) => (

              <button
                key={angkatan}
                type="button"
                className={
                  selectedAngkatan === angkatan
                    ? 'ranking-tab active'
                    : 'ranking-tab'
                }
                onClick={() => setSelectedAngkatan(angkatan)}
              >
                Angkatan {angkatan}
              </button>

            ))}

          </div>


          {/* TABLE */}
          <div className="ranking-table-wrapper">

            <table className="ranking-table">

              <thead>
                <tr>
                  <th>PERINGKAT</th>
                  <th>MAHASISWA</th>
                  <th>NIM</th>
                  <th>PROGRAM STUDI</th>
                  <th>NILAI TAHAP 1</th>
                  <th>STATUS</th>
                </tr>
              </thead>


              <tbody>

                {currentRanking.map((student) => (

                  <tr key={student.nim}>

                    <td>
                      <div className={`ranking-position rank-${student.rank}`}>
                        {student.rank}
                      </div>
                    </td>


                    <td>
                      <div className="ranking-student">

                        <div className="ranking-avatar">
                          {student.initials}
                        </div>

                        <div className="ranking-student-info">

                          <strong>
                            {student.name}
                          </strong>

                          <span>
                            Angkatan {selectedAngkatan}
                          </span>

                        </div>

                      </div>
                    </td>


                    <td>
                      {student.nim}
                    </td>


                    <td>
                      {student.prodi}
                    </td>


                    <td>
                      <strong className="ranking-score">
                        {student.score}
                      </strong>
                    </td>


                    <td>
                      <span className="ranking-status">
                        Kandidat Top 3
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* INFO */}
          <div className="ranking-info">

            <div className="ranking-info-icon">
              ✓
            </div>

            <div>

              <strong>
                Peringkat Sementara
              </strong>

              <p>
                Peringkat dapat berubah selama periode seleksi masih berlangsung.
                Tiga mahasiswa dengan nilai tertinggi setelah Tahap 1 ditutup akan
                melanjutkan ke Pradita Value.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}


export default PeringkatTahap1