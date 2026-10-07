import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Languages,
  LockKeyhole,
  Trophy,
  Users,
} from 'lucide-react'

import '../../styles/student/dashboard-ranking.css'

function DashboardRanking() {
  const navigate = useNavigate()
  const location = useLocation()

  /*
    ============================================
    DATA PENDAFTARAN
    ============================================

    Data dari proses sebelumnya akan dibawa
    melalui route state.

    Fallback dipakai selama frontend masih
    dalam tahap prototype.
  */

  const registrationData =
    location.state?.registrationData

  const student =
    registrationData?.student || {
      name: 'Allegra Aretha Putri',
      nim: '2410102004',
      angkatan: '2024',
      ipk: '3.88',
      skpi: '250',
    }

  const formData =
    registrationData?.formData || {
      hasPrestasi: 'ya',
      namaPrestasi: 'WEBSITEEKONOMIS',
      tingkatPrestasi: 'nasional',

      hasOrganisasi: 'ya',
      namaOrganisasi: 'Himsi',
      tingkatOrganisasi: 'lokal',
      jabatan: 'anggota',

      hasBahasa: 'tidak',
      bahasa: '',
      tingkatSertifikat: '',
      skor: '',
    }

  /*
    ============================================
    LABEL
    ============================================
  */

  const getPrestasiLevelLabel = (value) => {
    const labels = {
      internasional: 'Internasional',
      nasional: 'Nasional',
      lokal: 'Lokal',
    }

    return labels[value] || value || '-'
  }

  const getOrganisasiLevelLabel = (value) => {
    const labels = {
      internasional: 'Internasional',
      nasional: 'Nasional',
      lokal: 'Lokal / Kampus',
    }

    return labels[value] || value || '-'
  }

  const getJabatanLabel = (value) => {
    const labels = {
      ketua: 'Ketua',
      koordinator: 'Koordinator Divisi',
      anggota: 'Anggota',
    }

    return labels[value] || value || '-'
  }

  const getBahasaLabel = (value) => {
    const labels = {
      inggris: 'Bahasa Inggris',
      jepang: 'Bahasa Jepang',
      korea: 'Bahasa Korea',
      arab: 'Bahasa Arab',
    }

    return labels[value] || value || '-'
  }

  /*
    ============================================
    LIHAT DETAIL TAHAP 1
    ============================================
  */

  const handleViewDetail = () => {
    navigate(
      '/pendaftaran-mapres/status',
      {
        state: {
          registrationData,
        },
      }
    )
  }

  /*
    ============================================
    SIMULASI HASIL RANKING
    ============================================

    Ini hanya dipakai untuk demo frontend.

    Nanti status lolos, ranking, dan nilai
    berasal dari backend.
  */

  const handleSimulateRankingResult = () => {
    navigate(
      '/dashboard/finalis',
      {
        state: {
          registrationData,

          rankingResult: {
            rank: 2,
            tahap1Score: '86.40',
          },
        },
      }
    )
  }

  /*
    ============================================
    DATA RINGKASAN TAHAP 1
    ============================================
  */

  const indicators = [
    {
      id: 'ipk',
      title: 'IPK',
      value: `${student.ipk} / 4.00`,
      detail: '',
      status: 'verified',
      Icon: GraduationCap,
    },

    {
      id: 'skpi',
      title: 'SKPI',
      value: student.skpi,
      detail: '',
      status: 'verified',
      Icon: FileText,
    },

    {
      id: 'prestasi',
      title: 'Prestasi',
      value:
        formData.hasPrestasi === 'ya'
          ? formData.namaPrestasi
          : 'Tidak diajukan',
      detail:
        formData.hasPrestasi === 'ya'
          ? getPrestasiLevelLabel(
              formData.tingkatPrestasi
            )
          : '',
      status:
        formData.hasPrestasi === 'ya'
          ? 'verified'
          : 'not-submitted',
      Icon: Trophy,
    },

    {
      id: 'organisasi',
      title: 'Organisasi',
      value:
        formData.hasOrganisasi === 'ya'
          ? formData.namaOrganisasi
          : 'Tidak diajukan',
      detail:
        formData.hasOrganisasi === 'ya'
          ? `${getOrganisasiLevelLabel(
              formData.tingkatOrganisasi
            )} • ${getJabatanLabel(
              formData.jabatan
            )}`
          : '',
      status:
        formData.hasOrganisasi === 'ya'
          ? 'verified'
          : 'not-submitted',
      Icon: Users,
    },

    {
      id: 'bahasa',
      title: 'Bahasa Asing',
      value:
        formData.hasBahasa === 'ya'
          ? getBahasaLabel(
              formData.bahasa
            )
          : 'Tidak diajukan',
      detail:
        formData.hasBahasa === 'ya'
          ? `${formData.tingkatSertifikat} • Skor ${formData.skor}`
          : '',
      status:
        formData.hasBahasa === 'ya'
          ? 'verified'
          : 'not-submitted',
      Icon: Languages,
    },
  ]

  /*
    ============================================
    STATUS INDIKATOR
    ============================================
  */

  const renderIndicatorStatus = (
    status
  ) => {
    if (status === 'verified') {
      return (
        <span className="ranking-indicator-status ranking-status-verified">
          <CheckCircle2 size={13} />
          Terverifikasi
        </span>
      )
    }

    return (
      <span className="ranking-indicator-status ranking-status-neutral">
        Tidak Diajukan
      </span>
    )
  }

  return (
    <div className="ranking-dashboard-page">
      <div className="ranking-dashboard-container">

        {/* =========================
            HEADER
        ========================== */}

        <header className="ranking-page-header">
          <div>
            <span className="ranking-page-eyebrow">
              MAHASISWA BERPRESTASI
            </span>

            <h1>
              Seleksi Mahasiswa Berprestasi
            </h1>

            <p>
              Pantau status pendaftaran dan
              tahapan seleksi Anda.
            </p>
          </div>
        </header>

        {/* =========================
            STATUS UTAMA
        ========================== */}

        <section className="ranking-main-status-card">
          <div className="ranking-main-status-content">

            <div className="ranking-main-status-icon">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span className="ranking-main-status-label">
                TAHAP 1 SELESAI
              </span>

              <h2>
                Ranking Tahap 1 Sedang Diproses
              </h2>

              <p>
                Verifikasi data Anda telah selesai.
                Sistem sedang memproses ranking
                berdasarkan angkatan.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="ranking-detail-button"
            onClick={handleViewDetail}
          >
            Lihat Detail Tahap 1
            <ArrowRight size={15} />
          </button>
        </section>

        {/* =========================
            DEMO FRONTEND
        ========================== */}

        <div className="ranking-demo-area">
          <span>
            Demo Frontend
          </span>

          <button
            type="button"
            onClick={
              handleSimulateRankingResult
            }
          >
            Simulasikan Hasil Ranking
          </button>
        </div>

        {/* =========================
            CONTENT GRID
        ========================== */}

        <div className="ranking-dashboard-grid">

          {/* =========================
              RINGKASAN TAHAP 1
          ========================== */}

          <section className="ranking-summary-card">

            <div className="ranking-card-heading">
              <div>
                <h2>
                  Ringkasan Tahap 1
                </h2>

                <p>
                  Data yang digunakan dalam
                  penilaian Tahap 1.
                </p>
              </div>
            </div>

            <div className="ranking-indicator-list">

              {indicators.map((item) => {
                const Icon = item.Icon

                return (
                  <article
                    className="ranking-indicator-row"
                    key={item.id}
                  >

                    <div className="ranking-indicator-icon">
                      <Icon size={18} />
                    </div>

                    <div className="ranking-indicator-content">
                      <span>
                        {item.title}
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                      {item.detail && (
                        <small>
                          {item.detail}
                        </small>
                      )}
                    </div>

                    <div className="ranking-indicator-action">
                      {renderIndicatorStatus(
                        item.status
                      )}
                    </div>

                  </article>
                )
              })}

            </div>
          </section>

          {/* =========================
              TAHAP SELEKSI
          ========================== */}

          <section className="ranking-selection-card">

            <div className="ranking-card-heading">
              <div>
                <h2>
                  Tahap Seleksi
                </h2>

                <p>
                  Posisi Anda dalam proses
                  seleksi.
                </p>
              </div>
            </div>

            <div className="ranking-selection-timeline">

              {/* TAHAP 1 */}

              <div className="ranking-selection-step is-complete">

                <div className="ranking-selection-marker">
                  <CheckCircle2 size={16} />
                </div>

                <div className="ranking-selection-copy">
                  <strong>
                    Tahap 1
                  </strong>

                  <span>
                    Selesai
                  </span>
                </div>

              </div>

              <div className="ranking-selection-line is-complete" />

              {/* RANKING */}

              <div className="ranking-selection-step is-current">

                <div className="ranking-selection-marker">
                  2
                </div>

                <div className="ranking-selection-copy">
                  <strong>
                    Ranking per Angkatan
                  </strong>

                  <span>
                    Sedang diproses
                  </span>
                </div>

              </div>

              <div className="ranking-selection-line" />

              {/* PRADITA VALUE */}

              <div className="ranking-selection-step">

                <div className="ranking-selection-marker">
                  3
                </div>

                <div className="ranking-selection-copy">
                  <strong>
                    Pradita Value
                  </strong>

                  <span>
                    Belum tersedia
                  </span>
                </div>

              </div>

              <div className="ranking-selection-line" />

              {/* FINAL */}

              <div className="ranking-selection-step">

                <div className="ranking-selection-marker">
                  4
                </div>

                <div className="ranking-selection-copy">
                  <strong>
                    Pengumuman Final
                  </strong>

                  <span>
                    Belum tersedia
                  </span>
                </div>

              </div>

            </div>
          </section>

        </div>

        {/* =========================
            PRADITA VALUE
        ========================== */}

        <section className="ranking-pradita-card">

          <div className="ranking-pradita-content">

            <div className="ranking-pradita-icon">
              <LockKeyhole size={20} />
            </div>

            <div>
              <h2>
                Pradita Value
              </h2>

              <p>
                Tahap ini tersedia jika Anda
                masuk Top 3 pada ranking
                angkatan.
              </p>
            </div>

          </div>

          <span className="ranking-pradita-status">
            <LockKeyhole size={13} />
            Terkunci
          </span>

        </section>

        {/* =========================
            INFORMASI PENTING
        ========================== */}

        <section className="ranking-information-card">

          <div className="ranking-card-heading">
            <div>
              <h2>
                Informasi Penting
              </h2>

              <p>
                Informasi yang perlu diketahui
                selama proses ranking.
              </p>
            </div>
          </div>

          <div className="ranking-information-list">

            <div className="ranking-information-item">
              <span className="ranking-information-dot" />

              <p>
                Ranking dilakukan berdasarkan
                angkatan.
              </p>
            </div>

            <div className="ranking-information-item">
              <span className="ranking-information-dot" />

              <p>
                Top 3 dari setiap angkatan akan
                lanjut ke tahap Pradita Value.
              </p>
            </div>

            <div className="ranking-information-item">
              <span className="ranking-information-dot" />

              <p>
                Hasil ranking akan tampil di
                dashboard setelah proses selesai.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}

export default DashboardRanking