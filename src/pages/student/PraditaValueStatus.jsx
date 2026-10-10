import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'

import '../../styles/student/pradita-value-status.css'

function PraditaValueStatus() {
  const navigate = useNavigate()
  const location = useLocation()

  const registrationData =
    location.state?.registrationData

  const rankingResult =
    location.state?.rankingResult || {
      rank: 2,
      tahap1Score: '86.40',
    }

  const peerInvitations =
    location.state?.peerInvitations || [
      {
        id: 1,
        email:
          'rekan.satu@student.pradita.ac.id',
        status: 'sent',
      },
      {
        id: 2,
        email:
          'rekan.dua@student.pradita.ac.id',
        status: 'sent',
      },
      {
        id: 3,
        email:
          'rekan.tiga@student.pradita.ac.id',
        status: 'sent',
      },
    ]

  const praditaStage =
    location.state?.praditaStage ||
    'waiting-admin'

  const reviewerProgress =
    location.state?.reviewerProgress || {
      completed: 3,
      total: 5,
    }

  const student =
    registrationData?.student || {
      name: 'Allegra Aretha Putri',
      nim: '2410102004',
      angkatan: '2024',
    }

  const isInProgress =
    praditaStage === 'in-progress'

  const isCompleted =
    praditaStage === 'completed'

  const assessmentStarted =
    isInProgress || isCompleted

  const progressPercentage =
    (
      reviewerProgress.completed /
      reviewerProgress.total
    ) * 100

  const reviewerStatuses = {
    peers: isCompleted
      ? [
          { status: 'completed' },
          { status: 'completed' },
          { status: 'completed' },
        ]
      : [
          { status: 'completed' },
          { status: 'waiting' },
          { status: 'completed' },
        ],

    kaprodi: {
      name: 'Kaprodi Sistem Informasi',
      status:
        isCompleted
          ? 'completed'
          : 'waiting',
    },

    dosen: {
      name: 'Dosen Penilai',
      status: 'completed',
    },
  }

  const handleBack = () => {
    navigate('/dashboard/finalis', {
      state: {
        registrationData,
        rankingResult,
        peerInvitations,
        praditaStage,
        reviewerProgress,
      },
    })
  }

  const renderAssessmentStatus = (
    status
  ) => {
    if (status === 'completed') {
      return (
        <span className="pv-status-pill pv-status-completed">
          <CheckCircle2 size={13} />
          Sudah Mengisi
        </span>
      )
    }

    return (
      <span className="pv-status-pill pv-status-waiting">
        <Clock3 size={13} />
        Menunggu
      </span>
    )
  }

  return (
    <div className="pv-status-page">
      <div className="pv-status-container">

        <header className="pv-status-header">
          <div>
            <span className="pv-status-eyebrow">
              PRADITA VALUE
            </span>

            <h1>
              Status Penilaian
            </h1>

            <p>
              Pantau status penilai dan proses
              penilaian Pradita Value.
            </p>
          </div>
        </header>

        <button
          type="button"
          className="pv-back-button"
          onClick={handleBack}
        >
          <ArrowLeft size={17} />
          Kembali ke Dashboard
        </button>

        {!assessmentStarted && (
          <section className="pv-main-status-card">

            <div className="pv-main-status-content">

              <div className="pv-main-status-icon">
                <Clock3 size={22} />
              </div>

              <div className="pv-main-status-copy">

                <span className="pv-main-status-label">
                  PRADITA VALUE
                </span>

                <h2>
                  Menunggu Dosen Penilai
                </h2>

                <p>
                  Undangan untuk 3 rekan sejawat
                  telah dikirim dan Kaprodi Sistem
                  Informasi sudah tersedia.
                  Admin masih menentukan 1 dosen
                  penilai.
                </p>

                <div className="pv-main-student">
                  <strong>
                    {student.name}
                  </strong>

                  <span>
                    {student.nim}
                    {' • '}
                    Angkatan {student.angkatan}
                  </span>
                </div>

              </div>

            </div>

            <span className="pv-main-status-badge">
              Menunggu Dosen
            </span>

          </section>
        )}

        {isInProgress && (
          <section className="pv-main-status-card">

            <div className="pv-main-status-content">

              <div className="pv-main-status-icon">
                <ShieldCheck size={22} />
              </div>

              <div className="pv-main-status-copy">

                <span className="pv-main-status-label">
                  PRADITA VALUE
                </span>

                <h2>
                  Penilaian Sedang Berlangsung
                </h2>

                <p>
                  Seluruh 5 penilai sudah tersedia.
                  Status diperbarui saat penilai
                  mengirimkan hasil.
                </p>

                <div className="pv-main-student">
                  <strong>
                    {student.name}
                  </strong>

                  <span>
                    {student.nim}
                    {' • '}
                    Angkatan {student.angkatan}
                  </span>
                </div>

              </div>

            </div>

            <span className="pv-main-status-badge">
              Sedang Berlangsung
            </span>

          </section>
        )}

        {isCompleted && (
          <section className="pv-main-status-card">

            <div className="pv-main-status-content">

              <div className="pv-main-status-icon">
                <CheckCircle2 size={22} />
              </div>

              <div className="pv-main-status-copy">

                <span className="pv-main-status-label">
                  PRADITA VALUE
                </span>

                <h2>
                  Penilaian Selesai
                </h2>

                <p>
                  Seluruh 5 penilai telah
                  mengirimkan hasil. Proses
                  selanjutnya menunggu pengumuman
                  final.
                </p>

                <div className="pv-main-student">
                  <strong>
                    {student.name}
                  </strong>

                  <span>
                    {student.nim}
                    {' • '}
                    Angkatan {student.angkatan}
                  </span>
                </div>

              </div>

            </div>

            <span className="pv-main-status-badge">
              5/5 Selesai
            </span>

          </section>
        )}

        {assessmentStarted && (
          <section className="pv-progress-card">

            <div className="pv-progress-heading">

              <div>
                <h2>
                  Progress Penilaian
                </h2>

                <p>
                  Status pengisian dari seluruh
                  penilai Pradita Value.
                </p>
              </div>

              <strong>
                {reviewerProgress.completed} dari{' '}
                {reviewerProgress.total} penilai
                telah mengisi
              </strong>

            </div>

            <div className="pv-progress-track">

              <div
                className="pv-progress-fill"
                style={{
                  width:
                    `${progressPercentage}%`,
                }}
              />

            </div>

            <span className="pv-progress-note">
              {isCompleted
                ? 'Seluruh penilaian telah selesai.'
                : 'Penilaian selesai setelah seluruh penilai mengirimkan hasil.'}
            </span>

          </section>
        )}

        <div className="pv-reviewer-grid">

          <section className="pv-reviewer-card">

            <div className="pv-reviewer-heading">

              <div className="pv-reviewer-heading-icon">
                <Users size={19} />
              </div>

              <div className="pv-reviewer-heading-copy">

                <h2>
                  Rekan Sejawat
                </h2>

                <p>
                  Dipilih oleh mahasiswa finalis.
                </p>

              </div>

              <span
                className={
                  isCompleted ||
                  !assessmentStarted
                    ? 'pv-reviewer-summary pv-reviewer-summary-success'
                    : 'pv-reviewer-summary'
                }
              >
                {isCompleted
                  ? '3/3 Selesai'
                  : assessmentStarted
                    ? '3 Penilai'
                    : '3/3 Terkirim'}
              </span>

            </div>

            <div className="pv-reviewer-list">

              {peerInvitations.map(
                (peer, index) => {
                  const currentStatus =
                    reviewerStatuses
                      .peers[index]
                      ?.status || 'waiting'

                  return (
                    <div
                      className="pv-reviewer-item"
                      key={peer.id}
                    >

                      <div className="pv-reviewer-number">
                        {index + 1}
                      </div>

                      <div className="pv-reviewer-copy">

                        <span>
                          Rekan {index + 1}
                        </span>

                        <strong>
                          {peer.email}
                        </strong>

                      </div>

                      {!assessmentStarted ? (
                        <span className="pv-status-pill pv-status-sent">
                          <CheckCircle2 size={13} />
                          Undangan Terkirim
                        </span>
                      ) : (
                        renderAssessmentStatus(
                          currentStatus
                        )
                      )}

                    </div>
                  )
                }
              )}

            </div>

          </section>

          <section className="pv-reviewer-card">

            <div className="pv-reviewer-heading">

              <div className="pv-reviewer-heading-icon">
                <UserRound size={19} />
              </div>

              <div className="pv-reviewer-heading-copy">

                <h2>
                  Penilai Akademik
                </h2>

                <p>
                  Kaprodi sudah tetap, dosen
                  ditentukan oleh admin.
                </p>

              </div>

              <span
                className={
                  isCompleted
                    ? 'pv-reviewer-summary pv-reviewer-summary-success'
                    : 'pv-reviewer-summary'
                }
              >
                {isCompleted
                  ? '2/2 Selesai'
                  : assessmentStarted
                    ? '2 Penilai'
                    : '1 Siap · 1 Menunggu'}
              </span>

            </div>

            <div className="pv-reviewer-list">

              <div className="pv-reviewer-item">

                <div className="pv-reviewer-number">
                  4
                </div>

                <div className="pv-reviewer-copy">

                  <span>
                    Kaprodi Sistem Informasi
                  </span>

                  <strong>
                    {reviewerStatuses.kaprodi.name}
                  </strong>

                </div>

                {!assessmentStarted ? (
                  <span className="pv-status-pill pv-status-fixed">
                    <CheckCircle2 size={13} />
                    Sudah Ditentukan
                  </span>
                ) : (
                  renderAssessmentStatus(
                    reviewerStatuses
                      .kaprodi
                      .status
                  )
                )}

              </div>

              <div className="pv-reviewer-item">

                <div className="pv-reviewer-number">
                  5
                </div>

                <div className="pv-reviewer-copy">

                  <span>
                    Dosen Penilai
                  </span>

                  <strong>
                    {assessmentStarted
                      ? reviewerStatuses
                          .dosen
                          .name
                      : 'Belum ditentukan'}
                  </strong>

                </div>

                {!assessmentStarted ? (
                  <span className="pv-status-pill pv-status-admin">
                    <Clock3 size={13} />
                    Menunggu Admin
                  </span>
                ) : (
                  renderAssessmentStatus(
                    reviewerStatuses
                      .dosen
                      .status
                  )
                )}

              </div>

            </div>

          </section>

        </div>

        <section className="pv-information-card">

          <div className="pv-information-icon">
            <Mail size={18} />
          </div>

          <div>
            <h2>
              Informasi Penilaian
            </h2>

            {!assessmentStarted && (
              <p>
                Tidak ada tindakan tambahan dari
                mahasiswa. Pradita Value dimulai
                setelah admin menentukan dosen
                penilai.
              </p>
            )}

            {isInProgress && (
              <p>
                Pradita Value dinilai oleh
                3 rekan sejawat, Kaprodi Sistem
                Informasi, dan 1 dosen penilai.
              </p>
            )}

            {isCompleted && (
              <p>
                Seluruh penilaian Pradita Value
                telah selesai. Hasil final masih
                menunggu pengumuman.
              </p>
            )}
          </div>

        </section>

      </div>
    </div>
  )
}

export default PraditaValueStatus