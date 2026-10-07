import {
  Award,
  BookOpen,
  FileText,
  Info,
  Languages,
  LockKeyhole,
  Users,
} from 'lucide-react'

import '../../styles/student/dashboard.css'

function Dashboard() {
  /*
    ============================================
    MOCK DATA DASHBOARD
    ============================================

    Nanti data ini diganti response backend.
  */

  const registration = {
    status: 'Belum Dimulai',
    progress: 0,
  }

  const stageOneItems = [
    {
      id: 'ipk',
      title: 'IPK',
      description: 'Indeks Prestasi Kumulatif',
      status: 'Belum Tersedia',
      icon: BookOpen,
      source: 'master',
    },
    {
      id: 'skpi',
      title: 'SKPI',
      description: 'Surat Keterangan Pendamping Ijazah',
      status: 'Belum Tersedia',
      icon: FileText,
      source: 'master',
    },
    {
      id: 'prestasi',
      title: 'Prestasi',
      description: 'Prestasi terbaik yang diajukan',
      status: 'Belum Terisi',
      icon: Award,
      source: 'student',
    },
    {
      id: 'organisasi',
      title: 'Organisasi',
      description: 'Pengalaman organisasi',
      status: 'Belum Terisi',
      icon: Users,
      source: 'student',
    },
    {
      id: 'bahasa',
      title: 'Bahasa Asing',
      description: 'Sertifikasi kemampuan bahasa',
      status: 'Belum Terisi',
      icon: Languages,
      source: 'student',
    },
  ]

  const completedStageOne = stageOneItems.filter(
    (item) => item.status === 'Lengkap'
  ).length

  const selectionStages = [
    {
      number: 1,
      title: 'Tahap 1',
      description: 'Input Data & Verifikasi',
      status: 'BELUM DIMULAI',
    },
    {
      number: 2,
      title: 'Ranking per Angkatan',
      description: 'Top 3 setiap angkatan',
    },
    {
      number: 3,
      title: 'Pradita Value',
      description: 'Untuk 9 finalis',
    },
    {
      number: 4,
      title: 'Pengumuman Final',
      description: 'Juara 1, 2, dan 3',
    },
  ]

  const handleStartRegistration = () => {
    /*
      Nanti diarahkan ke halaman
      Pendaftaran Mapres.
    */

    console.log('Mulai Pendaftaran')
  }

  return (
    <div className="student-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="dashboard-hero">
        <div className="dashboard-container">
          <span className="dashboard-hero-badge">
            MAHASISWA BERPRESTASI
          </span>

          <h1>
            Selamat Datang di SIPRESTASI
          </h1>

          <p>
            Lengkapi data dan ikuti proses seleksi
            Mahasiswa Berprestasi.
          </p>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================== */}

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* =========================
              REGISTRATION PROGRESS
          ========================== */}

          <section className="dashboard-card registration-progress-card">
            <div className="registration-progress-header">
              <div>
                <div className="registration-status-row">
                  <span className="registration-status-badge">
                    {registration.status}
                  </span>

                  <span className="registration-status-dot" />

                  <span className="registration-status-text">
                    Pendaftaran belum diisi
                  </span>
                </div>

                <h2>
                  Pendaftaran Mahasiswa Berprestasi
                </h2>
              </div>

              <button
                type="button"
                className="dashboard-primary-button"
                onClick={handleStartRegistration}
              >
                Mulai Pendaftaran
              </button>
            </div>

            <div className="registration-progress-divider" />

            <div className="registration-progress-info">
              <span>
                Anda belum memulai pengisian data Tahap 1.
              </span>

              <strong>
                {registration.progress}%
              </strong>
            </div>

            <div className="registration-progress-track">
              <div
                className="registration-progress-fill"
                style={{
                  width: `${registration.progress}%`,
                }}
              />
            </div>
          </section>

          {/* =========================
              TWO COLUMN AREA
          ========================== */}

          <div className="dashboard-grid">

            {/* =========================
                STAGE ONE
            ========================== */}

            <section className="dashboard-card stage-one-card">
              <div className="dashboard-section-header">
                <div>
                  <h2>
                    Kelengkapan Tahap 1
                  </h2>

                  <p>
                    5 komponen verifikasi awal dokumen prestasi
                  </p>
                </div>

                <span className="dashboard-count-badge">
                  {completedStageOne} / {stageOneItems.length} Lengkap
                </span>
              </div>

              <div className="dashboard-section-divider" />

              <div className="stage-one-grid">
                {stageOneItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <article
                      key={item.id}
                      className={`stage-one-item ${
                        item.id === 'bahasa'
                          ? 'stage-one-item-wide'
                          : ''
                      }`}
                    >
                      <div className="stage-one-item-header">
                        <div className="stage-one-icon">
                          <Icon size={19} />
                        </div>

                        <span className="stage-one-status">
                          {item.status}
                        </span>
                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      {item.source === 'master' && (
                        <span className="stage-one-source">
                          Data dari master akademik
                        </span>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* =========================
                SELECTION TIMELINE
            ========================== */}

            <section className="dashboard-card selection-card">
              <div className="dashboard-section-header">
                <div>
                  <h2>
                    Tahap Seleksi
                  </h2>

                  <p>
                    Alur proses penilaian Pemilihan
                    Mahasiswa Berprestasi
                  </p>
                </div>
              </div>

              <div className="dashboard-section-divider" />

              <div className="selection-timeline">
                {selectionStages.map(
                  (stage, index) => (
                    <div
                      key={stage.number}
                      className="selection-step"
                    >
                      <div className="selection-step-marker">
                        <div className="selection-step-number">
                          {stage.number}
                        </div>

                        {index <
                          selectionStages.length - 1 && (
                          <div className="selection-step-line" />
                        )}
                      </div>

                      <div className="selection-step-content">
                        <div className="selection-step-title-row">
                          <h3>
                            {stage.title}
                          </h3>

                          {stage.status && (
                            <span className="selection-step-status">
                              {stage.status}
                            </span>
                          )}
                        </div>

                        <p>
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="selection-notice">
                <Info size={16} />

                <span>
                  Pendaftaran belum dimulai. Mulai
                  pendaftaran untuk memasuki Tahap 1.
                </span>
              </div>
            </section>
          </div>

          {/* =========================
              PRADITA VALUE
          ========================== */}

          <section className="dashboard-card pradita-value-card">
            <div className="pradita-value-header">
              <div className="pradita-value-title">
                <div className="pradita-value-icon">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <h2>
                    Pradita Value
                  </h2>

                  <p>
                    Hanya untuk finalis
                  </p>
                </div>
              </div>

              <span className="pradita-value-lock">
                <LockKeyhole size={14} />
                Terkunci
              </span>
            </div>

            <p className="pradita-value-description">
              Penilaian Pradita Value akan dibuka jika
              Anda lolos sebagai 9 finalis.
            </p>
          </section>

          {/* =========================
              IMPORTANT INFO
          ========================== */}

          <section className="dashboard-card important-info-card">
            <div className="important-info-heading">
              <div className="important-info-icon">
                <Info size={18} />
              </div>

              <h2>
                Informasi Penting
              </h2>
            </div>

            <div className="dashboard-section-divider" />

            <ul>
              <li>
                Pastikan seluruh data Tahap 1 sudah benar
                sebelum dikirim.
              </li>

              <li>
                Tahap 1 mencakup IPK, SKPI, Prestasi,
                Organisasi, dan Bahasa Asing.
              </li>

              <li>
                IPK dan SKPI diperoleh dari master data
                akademik berdasarkan NIM mahasiswa.
              </li>

              <li>
                Pradita Value hanya dinilai untuk 9 finalis.
              </li>

              <li>
                Hasil akhir ditentukan dari gabungan nilai
                Tahap 1 dan Pradita Value.
              </li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  )
}

export default Dashboard