import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  Trophy,
  Users,
} from 'lucide-react'

import '../../styles/student/dashboard-finalis.css'

function DashboardFinalis() {
  const navigate = useNavigate()
  const location = useLocation()

  /*
    ============================================
    DATA DARI PROSES SEBELUMNYA
    ============================================
  */

  const registrationData =
    location.state?.registrationData

  const rankingResult =
    location.state?.rankingResult || {
      rank: 2,
      tahap1Score: '86.40',
    }

  /*
    Data ini dikirim dari halaman
    PraditaValuePeers setelah mahasiswa
    mengirim 3 email rekan sejawat.
  */

  const peerInvitations =
    location.state?.peerInvitations || []

  const peersAlreadySubmitted =
    peerInvitations.length === 3

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
    NAVIGATION
    ============================================
  */

  const handleOpenPeerForm = () => {
    navigate('/pradita-value/rekan-sejawat', {
      state: {
        registrationData,
        rankingResult,
        peerInvitations,
      },
    })
  }

  /*
    Route status belum dibuat.
    Ini akan kita sambungkan setelah
    halaman status Pradita Value dibuat.
  */

  const handleViewPraditaStatus = () => {
    navigate('/pradita-value/status', {
      state: {
        registrationData,
        rankingResult,
        peerInvitations,
      },
    })
  }

  /*
    ============================================
    RINGKASAN TAHAP 1
    ============================================
  */

  const indicators = [
    {
      id: 'ipk',
      title: 'IPK',
      value: `${student.ipk} / 4.00`,
      detail: 'Data akademik',
      status: 'verified',
      Icon: GraduationCap,
    },

    {
      id: 'skpi',
      title: 'SKPI',
      value: student.skpi,
      detail: 'Data akademik',
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

  const renderIndicatorStatus = (status) => {
    if (status === 'verified') {
      return (
        <span className="finalis-indicator-status finalis-status-verified">
          <CheckCircle2 size={13} />
          Terverifikasi
        </span>
      )
    }

    return (
      <span className="finalis-indicator-status finalis-status-neutral">
        Tidak Diajukan
      </span>
    )
  }

  return (
    <div className="finalis-dashboard-page">
      <div className="finalis-dashboard-container">

        {/* =========================
            HEADER
        ========================== */}

        <header className="finalis-page-header">
          <div>
            <span className="finalis-page-eyebrow">
              MAHASISWA BERPRESTASI
            </span>

            <h1>
              Seleksi Mahasiswa Berprestasi
            </h1>

            <p>
              Pantau hasil seleksi dan tahapan
              berikutnya.
            </p>
          </div>
        </header>

        {/* =========================
            HASIL TAHAP 1
        ========================== */}

        <section className="finalis-result-card">

          <div className="finalis-result-main">

            <div className="finalis-result-icon">
              <Trophy size={22} />
            </div>

            <div>
              <span className="finalis-result-label">
                LOLOS TAHAP 1
              </span>

              <h2>
                Selamat, Anda Masuk Top 3 Angkatan{' '}
                {student.angkatan}
              </h2>

              <p>
                Anda berhasil melanjutkan ke tahap
                Pradita Value.
              </p>
            </div>

          </div>

          <div className="finalis-result-stats">

            <div>
              <span>
                Peringkat Angkatan
              </span>

              <strong>
                #{rankingResult.rank}
              </strong>
            </div>

            <div>
              <span>
                Nilai Tahap 1
              </span>

              <strong>
                {rankingResult.tahap1Score}
              </strong>
            </div>

          </div>

        </section>

        {/* =========================
            MAIN GRID
        ========================== */}

        <div className="finalis-dashboard-grid">

          {/* RINGKASAN */}

          <section className="finalis-summary-card">

            <div className="finalis-card-heading">
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

            <div className="finalis-indicator-list">

              {indicators.map((item) => {
                const Icon = item.Icon

                return (
                  <article
                    className="finalis-indicator-row"
                    key={item.id}
                  >

                    <div className="finalis-indicator-icon">
                      <Icon size={18} />
                    </div>

                    <div className="finalis-indicator-content">

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

                    <div className="finalis-indicator-action">
                      {renderIndicatorStatus(
                        item.status
                      )}
                    </div>

                  </article>
                )
              })}

            </div>

          </section>

          {/* TAHAP SELEKSI */}

          <section className="finalis-selection-card">

            <div className="finalis-card-heading">
              <div>
                <h2>
                  Tahap Seleksi
                </h2>

                <p>
                  Posisi Anda dalam proses seleksi.
                </p>
              </div>
            </div>

            <div className="finalis-selection-timeline">

              <div className="finalis-selection-step is-complete">

                <div className="finalis-selection-marker">
                  <CheckCircle2 size={16} />
                </div>

                <div className="finalis-selection-copy">
                  <strong>
                    Tahap 1
                  </strong>

                  <span>
                    Selesai
                  </span>
                </div>

              </div>

              <div className="finalis-selection-line is-complete" />

              <div className="finalis-selection-step is-complete">

                <div className="finalis-selection-marker">
                  <CheckCircle2 size={16} />
                </div>

                <div className="finalis-selection-copy">
                  <strong>
                    Ranking per Angkatan
                  </strong>

                  <span>
                    Lolos Top 3
                  </span>
                </div>

              </div>

              <div className="finalis-selection-line is-complete" />

              <div className="finalis-selection-step is-current">

                <div className="finalis-selection-marker">
                  3
                </div>

                <div className="finalis-selection-copy">
                  <strong>
                    Pradita Value
                  </strong>

                  <span>
                    {peersAlreadySubmitted
                      ? 'Menunggu penilai'
                      : 'Lengkapi rekan sejawat'}
                  </span>
                </div>

              </div>

              <div className="finalis-selection-line" />

              <div className="finalis-selection-step">

                <div className="finalis-selection-marker">
                  4
                </div>

                <div className="finalis-selection-copy">
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

        {!peersAlreadySubmitted ? (

          /*
            ====================================
            BELUM ISI REKAN SEJAWAT
            ====================================
          */

          <section className="finalis-pradita-card">

            <div className="finalis-pradita-top">

              <div className="finalis-pradita-content">

                <div className="finalis-pradita-icon">
                  <Mail size={20} />
                </div>

                <div>
                  <span className="finalis-pradita-label">
                    TAHAP BERIKUTNYA
                  </span>

                  <h2>
                    Pradita Value
                  </h2>

                  <p>
                    Masukkan email 3 rekan sejawat
                    untuk memulai proses penilaian.
                  </p>
                </div>

              </div>

              <span className="finalis-pradita-status">
                Perlu Dilengkapi
              </span>

            </div>

            <div className="finalis-pradita-info">

              <div>
                <span>
                  Rekan Sejawat
                </span>

                <strong>
                  3 mahasiswa
                </strong>
              </div>

              <div>
                <span>
                  Dosen Penilai
                </span>

                <strong>
                  Ditentukan Admin
                </strong>
              </div>

              <div>
                <span>
                  Undangan
                </span>

                <strong>
                  Dikirim Sistem
                </strong>
              </div>

            </div>

            <div className="finalis-pradita-bottom">

              <p>
                Anda hanya perlu mengisi email
                3 rekan sejawat. Kaprodi dan
                dosen penilai ditentukan oleh admin.
              </p>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={handleOpenPeerForm}
              >
                Isi Email Rekan Sejawat
                <ArrowRight size={15} />
              </button>

            </div>

          </section>

        ) : (

          /*
            ====================================
            SUDAH KIRIM 3 UNDANGAN
            ====================================
          */

          <section className="finalis-pradita-card finalis-pradita-card-sent">

            <div className="finalis-pradita-top">

              <div className="finalis-pradita-content">

                <div className="finalis-pradita-icon finalis-pradita-icon-success">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <span className="finalis-pradita-label finalis-pradita-label-success">
                    PRADITA VALUE
                  </span>

                  <h2>
                    Undangan Rekan Sejawat Terkirim
                  </h2>

                  <p>
                    Bagian rekan sejawat telah
                    dilengkapi. Proses selanjutnya
                    menunggu penilai dari admin.
                  </p>
                </div>

              </div>

              <span className="finalis-pradita-status finalis-pradita-status-success">
                <CheckCircle2 size={13} />
                3/3 Terkirim
              </span>

            </div>

            <div className="finalis-pradita-info">

              <div>
                <span>
                  Rekan Sejawat
                </span>

                <strong className="finalis-success-text">
                  3 Undangan Terkirim
                </strong>
              </div>

              <div>
                <span>
                  Kaprodi
                </span>

                <strong className="finalis-waiting-text">
                  Menunggu Admin
                </strong>
              </div>

              <div>
                <span>
                  Dosen
                </span>

                <strong className="finalis-waiting-text">
                  Menunggu Admin
                </strong>
              </div>

            </div>

            {/* EMAIL YANG SUDAH DIKIRIM */}

            <div className="finalis-peer-email-section">

              <div className="finalis-peer-email-heading">

                <div>
                  <h3>
                    Rekan Sejawat
                  </h3>

                  <p>
                    Undangan telah dikirim ke email
                    berikut.
                  </p>
                </div>

              </div>

              <div className="finalis-peer-email-list">

                {peerInvitations.map(
                  (peer, index) => (
                    <div
                      className="finalis-peer-email-item"
                      key={peer.id}
                    >

                      <div className="finalis-peer-email-number">
                        {index + 1}
                      </div>

                      <div className="finalis-peer-email-copy">

                        <span>
                          Rekan {index + 1}
                        </span>

                        <strong>
                          {peer.email}
                        </strong>

                      </div>

                      <span className="finalis-peer-email-status">
                        <CheckCircle2 size={12} />
                        Terkirim
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            <div className="finalis-pradita-bottom">

              <div className="finalis-waiting-admin">

                <Clock3 size={15} />

                <p>
                  Menunggu admin menentukan Kaprodi
                  dan dosen penilai.
                </p>

              </div>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={handleViewPraditaStatus}
              >
                Lihat Status Penilaian
                <ArrowRight size={15} />
              </button>

            </div>

          </section>

        )}

        {/* =========================
            INFORMASI PENTING
        ========================== */}

        <section className="finalis-information-card">

          <div className="finalis-card-heading">
            <div>
              <h2>
                Informasi Penting
              </h2>

              <p>
                Informasi untuk tahap Pradita Value.
              </p>
            </div>
          </div>

          <div className="finalis-information-list">

            {!peersAlreadySubmitted ? (
              <>
                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Masukkan 3 email rekan sejawat
                    yang akan memberikan penilaian.
                  </p>
                </div>

                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Rekan sejawat harus menggunakan
                    email mahasiswa dengan domain
                    @student.pradita.ac.id.
                  </p>
                </div>
              </>
            ) : (
              <div className="finalis-information-item">
                <span className="finalis-information-dot" />

                <p>
                  Undangan untuk 3 rekan sejawat
                  telah dikirim melalui sistem.
                </p>
              </div>
            )}

            <div className="finalis-information-item">
              <span className="finalis-information-dot" />

              <p>
                Kaprodi dan 1 dosen penilai
                ditentukan oleh admin.
              </p>
            </div>

            <div className="finalis-information-item">
              <span className="finalis-information-dot" />

              <p>
                Status penilaian akan diperbarui
                setelah penilai mulai memberikan
                penilaian.
              </p>
            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default DashboardFinalis