import { useEffect } from 'react'
import { usePortal } from '../../data/portal'
import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  Info,
  Languages,
  LockKeyhole,
  Users,
} from 'lucide-react'

import '../../styles/student/dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  /*
    ============================================
    DATA DARI BACKEND
    ============================================
  */

  const portal = usePortal()
  const { student } = portal

  useEffect(() => {
    if (['top3', 'pending_reviewed', 'ranked'].includes(portal.submission?.status)) {
      navigate('/dashboard/finalis', { replace: true })
    } else if (portal.submission && portal.submission.status !== 'draft') {
      navigate('/dashboard/ranking', { replace: true })
    }
  }, [portal.submission, navigate])

  const stageOneItems = [
    {
      id: 'prestasi',
      title: 'Prestasi',
      value: 'Belum diisi',
      status: 'Belum diisi',
      type: 'empty',
      icon: Award,
    },
    {
      id: 'organisasi',
      title: 'Organisasi',
      value: 'Belum diisi',
      status: 'Belum diisi',
      type: 'empty',
      icon: Users,
    },
    {
      id: 'bahasa',
      title: 'Bahasa Asing',
      value: 'Belum diisi',
      status: 'Belum diisi',
      type: 'empty',
      icon: Languages,
    },
  ]

  const draftFormData = portal.registrationData?.formData || {}
  const hasDraft = Boolean(
    portal.submission?.status === 'draft' &&
    (draftFormData.hasPrestasi || draftFormData.hasOrganisasi || draftFormData.hasBahasa ||
     portal.documents?.prestasi || portal.documents?.organisasi || portal.documents?.bahasa)
  )

  for (const item of stageOneItems) {
    if (['ipk', 'skpi'].includes(item.id)) continue
    const document = portal.documents[item.id]
    const choiceField = { prestasi: 'hasPrestasi', organisasi: 'hasOrganisasi', bahasa: 'hasBahasa' }[item.id]
    const nameField = { prestasi: 'namaPrestasi', organisasi: 'namaOrganisasi', bahasa: 'bahasa' }[item.id]

    if (document) {
      const prefix = { prestasi: 'pres', organisasi: 'org', bahasa: 'bah' }[item.id]
      item.value = draftFormData[nameField] || document[`${prefix}_cat`].replaceAll('_', ' ')
      item.status = portal.submission?.status === 'draft'
        ? 'Draft Tersimpan'
        : ({ verified: 'Terverifikasi', revisi: 'Perlu Revisi', ditolak: 'Ditolak', pending: 'Sedang Diverifikasi' }[document[`${prefix}_status`]] || 'Tersimpan')
      item.type = (document[`${prefix}_status`] === 'verified' || portal.submission?.status === 'draft') ? 'available' : 'empty'
    } else if (draftFormData[choiceField] === 'tidak') {
      item.value = 'Tidak ada yang diajukan'
      item.status = 'Tersimpan (Tidak Ada)'
      item.type = 'available'
    } else if (draftFormData[choiceField] === 'ya') {
      item.value = draftFormData[nameField] || 'Sedang diisi'
      item.status = 'Draft'
      item.type = 'available'
    }
  }

  const selectionStages = [
    {
      number: 1,
      title: 'Tahap 1',
      description: 'Pengisian dan verifikasi data',
      current: true,
    },
    {
      number: 2,
      title: 'Ranking per Angkatan',
      description: 'Menentukan Top 3 setiap angkatan',
    },
    {
      number: 3,
      title: 'Pradita Value',
      description: 'Penilaian untuk finalis',
    },
    {
      number: 4,
      title: 'Pengumuman Final',
      description: 'Hasil akhir seleksi',
    },
  ]

  const formatPeriodDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const todayYmd = new Date().toISOString().slice(0, 10)
  const periodStart = portal.period?.tanggal_mulai || ''
  const periodEnd = portal.period?.tanggal_selesai || ''
  const isPeriodClosed = Boolean(
    portal.period?.is_closed === true ||
      portal.period?.is_closed === 1 ||
      portal.period?.is_closed === '1' ||
      portal.period?.is_closed === 't'
  )
  const isBeforePeriodStart = Boolean(periodStart && todayYmd < periodStart)
  const isAfterPeriodEnd = Boolean(periodEnd && todayYmd > periodEnd)
  const isRegistrationLocked = isPeriodClosed || isBeforePeriodStart || isAfterPeriodEnd

  const handleStartRegistration = () => {
    if (isRegistrationLocked) return
    navigate(['top3', 'pending_reviewed', 'ranked'].includes(portal.submission?.status) ? '/dashboard/finalis' : portal.submission && portal.submission.status !== 'draft' ? '/dashboard/ranking' : '/pendaftaran-mapres')
  }

  return (
    <div className="student-dashboard-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="dashboard-hero">
        <div className="dashboard-container">

          <h1>
            Portal Seleksi SIPRESTASI
          </h1>

          <p>
            Lengkapi data Tahap 1 untuk mengikuti
            proses seleksi Mahasiswa Berprestasi.
          </p>

        </div>
      </section>

      {/* =========================
          MAIN
      ========================== */}

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* =========================
              REGISTRATION
          ========================== */}

          <section className="dashboard-registration">

            <div className="dashboard-registration-copy">

              <div className="dashboard-registration-title-row">
                <h2>
                  Pendaftaran Seleksi
                </h2>

                <span className={`registration-status ${isBeforePeriodStart || isPeriodClosed || isAfterPeriodEnd ? '' : hasDraft ? 'is-draft' : ''}`}>
                  {isBeforePeriodStart
                    ? 'Belum Dibuka'
                    : isPeriodClosed || isAfterPeriodEnd
                      ? 'Ditutup'
                      : hasDraft
                        ? 'Draft Tersimpan'
                        : 'Belum Dimulai'}
                </span>
              </div>

              <p>
                {isBeforePeriodStart
                  ? `Pendaftaran Seleksi Tahap 1 belum dibuka. Jadwal resmi dibuka mulai ${formatPeriodDate(periodStart)}.`
                  : isPeriodClosed || isAfterPeriodEnd
                    ? 'Periode pendaftaran Seleksi Tahap 1 saat ini telah ditutup.'
                    : hasDraft
                      ? 'Draft pendaftaran Tahap 1 Anda telah tersimpan. Lanjutkan pengisian atau kirim pendaftaran Anda.'
                      : 'Anda belum mengisi data Tahap 1. Mulai pendaftaran untuk melengkapi data yang dibutuhkan.'}
              </p>

            </div>

            <button
              type="button"
              className="dashboard-primary-button"
              disabled={isRegistrationLocked}
              style={isRegistrationLocked ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
              onClick={handleStartRegistration}
            >
              {isBeforePeriodStart
                ? `Dibuka ${formatPeriodDate(periodStart)}`
                : isPeriodClosed || isAfterPeriodEnd
                  ? 'Pendaftaran Ditutup'
                  : hasDraft
                    ? 'Lanjutkan Pendaftaran'
                    : 'Mulai Pendaftaran'}
              <ArrowRight size={18} />
            </button>

          </section>

          {/* =========================
              TWO COLUMN
          ========================== */}

          <div className="dashboard-content-grid">

            {/* =========================
                TAHAP 1
            ========================== */}

            <section className="dashboard-panel stage-one-panel">

              <div className="dashboard-panel-heading">

                <div>
                  <span className="dashboard-section-label">
                    TAHAP 1
                  </span>

                  <h2>
                    Data Pendaftaran
                  </h2>

                  <p>
                    Cek data yang sudah tersedia dan
                    lengkapi bagian yang masih kosong.
                  </p>
                </div>

              </div>

              <div className="stage-one-list">

                {stageOneItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.id}
                      className="stage-one-row"
                    >

                      <div className="stage-one-row-main">

                        <div className="stage-one-row-icon">
                          <Icon size={18} />
                        </div>

                        <div className="stage-one-row-copy">

                          <span>
                            {item.title}
                          </span>

                          <strong
                            className={
                              item.type === 'empty'
                                ? 'stage-one-empty-value'
                                : ''
                            }
                          >
                            {item.value}
                          </strong>

                        </div>

                      </div>

                      <span
                        className={`stage-one-row-status ${
                          item.type === 'available'
                            ? 'is-available'
                            : 'is-empty'
                        }`}
                      >
                        {item.type === 'available' && (
                          <CheckCircle2 size={13} />
                        )}

                        {item.status}
                      </span>

                    </div>
                  )
                })}

              </div>

            </section>

            {/* =========================
                TAHAP SELEKSI
            ========================== */}

            <section className="dashboard-panel selection-panel">

              <div className="dashboard-panel-heading">

                <div>
                  <span className="dashboard-section-label">
                    PROSES SELEKSI
                  </span>

                  <h2>
                    Tahap Seleksi
                  </h2>

                  <p>
                    Alur seleksi yang akan Anda jalani.
                  </p>
                </div>

              </div>

              <div className="selection-timeline">

                {selectionStages.map(
                  (stage, index) => (
                    <div
                      className={`selection-step ${
                        stage.current
                          ? 'is-current'
                          : ''
                      }`}
                      key={stage.number}
                    >

                      <div className="selection-marker-column">

                        <div className="selection-number">
                          {stage.number}
                        </div>

                        {index <
                          selectionStages.length - 1 && (
                          <div className="selection-line" />
                        )}

                      </div>

                      <div className="selection-copy">

                        <div className="selection-title-row">

                          <strong>
                            {stage.title}
                          </strong>

                          {stage.current && (
                            <span>
                              Sekarang
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

            </section>

          </div>

          {/* =========================
              PRADITA VALUE
          ========================== */}

          <section className="dashboard-pradita-card">

            <div className="dashboard-pradita-main">

              <div className="dashboard-pradita-icon">
                <LockKeyhole size={20} />
              </div>

              <div className="dashboard-pradita-copy">

                <span>
                  TAHAP LANJUTAN
                </span>

                <h2>
                  Pradita Value
                </h2>

                <p>
                  Penilaian Pradita Value dibuka
                  setelah Anda masuk Top 3 angkatan.
                </p>

              </div>

            </div>

            <div className="dashboard-pradita-status">
              <LockKeyhole size={14} />
              Terkunci
            </div>

          </section>

          {/* =========================
              INFORMATION
          ========================== */}

          <section className="dashboard-information">

            <div className="dashboard-information-heading">

              <div className="dashboard-information-icon">
                <Info size={18} />
              </div>

              <div>
                <h2>
                  Informasi Penting
                </h2>

                <p>
                  Hal yang perlu diperhatikan sebelum
                  memulai pendaftaran.
                </p>
              </div>

            </div>

            <div className="dashboard-information-list">

              <div className="dashboard-information-item">
                <span />

                <p>
                  Pastikan data yang Anda isi pada
                  Tahap 1 sudah benar sebelum dikirim.
                </p>
              </div>

              <div className="dashboard-information-item">
                <span />

                <p>
                  Tahap 1 mencakup IPK, SKPI,
                  Prestasi, Organisasi, dan
                  Bahasa Asing.
                </p>
              </div>

              <div className="dashboard-information-item">
                <span />

                <p>
                  Pradita Value dibuka setelah Anda
                  lolos Top 3 angkatan.
                </p>
              </div>

            </div>

          </section>

        </div>
      </main>

    </div>
  )
}

export default Dashboard
