import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Languages,
  Mail,
  Medal,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react'

import mockSelectionData, {
  REVIEW_STATUS,
  SELECTION_STATUS,
} from '../../data/mockSelectionData'

import '../../styles/student/dashboard-finalis.css'

function DashboardFinalis() {
  const navigate = useNavigate()
  const location = useLocation()

  /*
    =========================================================
    LEGACY DATA

    Masih dipakai sementara supaya halaman lama
    tetap bisa terhubung selama proses refactor.
    =========================================================
  */

  const registrationData =
    location.state?.registrationData || null

  const legacyRankingResult =
    location.state?.rankingResult || null

  const legacyPeerInvitations =
    location.state?.peerInvitations || null

  const legacyPraditaStage =
    location.state?.praditaStage || null

  const legacyReviewerProgress =
    location.state?.reviewerProgress || null

  const legacyFinalResult =
    location.state?.finalResult || null

  /*
    =========================================================
    HELPER
    =========================================================
  */

  const formatScore = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    const numberValue = Number(value)

    if (Number.isNaN(numberValue)) {
      return value
    }

    return numberValue.toFixed(2)
  }

  const mapLegacyStageToStatus = (stage) => {
    const mapping = {
      'need-peers':
        SELECTION_STATUS.NEED_PEERS,

      'waiting-admin':
        SELECTION_STATUS.WAITING_LECTURER,

      'in-progress':
        SELECTION_STATUS.PRADITA_IN_PROGRESS,

      completed:
        SELECTION_STATUS.PRADITA_COMPLETED,

      'final-announced':
        SELECTION_STATUS.FINAL_ANNOUNCED,
    }

    return mapping[stage] || null
  }

  /*
    =========================================================
    FIX UTAMA

    Kalau field ya/tidak dari form lama tidak tersedia,
    gunakan nilai dari mockSelectionData.
    =========================================================
  */

  const resolveSubmittedValue = (
    legacyValue,
    fallbackValue
  ) => {
    if (legacyValue === 'ya') {
      return true
    }

    if (legacyValue === 'tidak') {
      return false
    }

    return fallbackValue
  }

  /*
    =========================================================
    CREATE DATA FROM OLD ROUTER STATE
    =========================================================
  */

  const createSelectionDataFromLegacy = () => {
    const hasLegacyData =
      registrationData ||
      legacyRankingResult ||
      legacyPeerInvitations ||
      legacyPraditaStage ||
      legacyReviewerProgress ||
      legacyFinalResult

    if (!hasLegacyData) {
      return null
    }

    const oldStudent =
      registrationData?.student || {}

    const oldFormData =
      registrationData?.formData || {}

    let status =
      mapLegacyStageToStatus(
        legacyPraditaStage
      )

    if (!status) {
      if (
        legacyPeerInvitations &&
        legacyPeerInvitations.length === 3
      ) {
        status =
          SELECTION_STATUS.WAITING_LECTURER
      } else {
        status =
          SELECTION_STATUS.NEED_PEERS
      }
    }

    /*
      =========================================================
      TAHAP 1 FALLBACK

      Ini bagian yang memperbaiki Prestasi,
      Organisasi, dan Bahasa Asing.
      =========================================================
    */

    const prestasiSubmitted =
      resolveSubmittedValue(
        oldFormData.hasPrestasi,
        mockSelectionData.tahap1.prestasi.submitted
      )

    const organisasiSubmitted =
      resolveSubmittedValue(
        oldFormData.hasOrganisasi,
        mockSelectionData.tahap1.organisasi.submitted
      )

    const bahasaSubmitted =
      resolveSubmittedValue(
        oldFormData.hasBahasa,
        mockSelectionData.tahap1.bahasaAsing.submitted
      )

    const prestasiData = {
      submitted:
        prestasiSubmitted,

      name:
        prestasiSubmitted
          ? (
              oldFormData.namaPrestasi ||
              mockSelectionData
                .tahap1
                .prestasi
                .name
            )
          : null,

      level:
        prestasiSubmitted
          ? (
              oldFormData.tingkatPrestasi ||
              mockSelectionData
                .tahap1
                .prestasi
                .level
            )
          : null,

      verificationStatus:
        prestasiSubmitted
          ? 'verified'
          : null,
    }

    const organisasiData = {
      submitted:
        organisasiSubmitted,

      name:
        organisasiSubmitted
          ? (
              oldFormData.namaOrganisasi ||
              mockSelectionData
                .tahap1
                .organisasi
                .name
            )
          : null,

      level:
        organisasiSubmitted
          ? (
              oldFormData.tingkatOrganisasi ||
              mockSelectionData
                .tahap1
                .organisasi
                .level
            )
          : null,

      position:
        organisasiSubmitted
          ? (
              oldFormData.jabatan ||
              mockSelectionData
                .tahap1
                .organisasi
                .position
            )
          : null,

      verificationStatus:
        organisasiSubmitted
          ? 'verified'
          : null,
    }

    const bahasaData = {
      submitted:
        bahasaSubmitted,

      language:
        bahasaSubmitted
          ? (
              oldFormData.bahasa ||
              mockSelectionData
                .tahap1
                .bahasaAsing
                .language
            )
          : null,

      certificate:
        bahasaSubmitted
          ? (
              oldFormData.tingkatSertifikat ||
              mockSelectionData
                .tahap1
                .bahasaAsing
                .certificate
            )
          : null,

      score:
        bahasaSubmitted
          ? (
              oldFormData.skor ||
              mockSelectionData
                .tahap1
                .bahasaAsing
                .score
            )
          : null,

      verificationStatus:
        bahasaSubmitted
          ? 'verified'
          : null,
    }

    /*
      =========================================================
      REVIEWERS
      =========================================================
    */

    let peers = []

    if (
      legacyPeerInvitations &&
      legacyPeerInvitations.length > 0
    ) {
      peers =
        legacyPeerInvitations.map(
          (peer, index) => ({
            id:
              peer.id ||
              index + 1,

            email:
              peer.email ||
              `rekan.${index + 1}@student.pradita.ac.id`,

            invitationStatus:
              REVIEW_STATUS.INVITED,

            reviewStatus:
              REVIEW_STATUS.WAITING,
          })
        )
    } else if (
      status !==
      SELECTION_STATUS.NEED_PEERS
    ) {
      peers =
        mockSelectionData
          .reviewers
          .peers
          .map((peer) => ({
            ...peer,
          }))
    }

    const lecturerReady =
      status ===
        SELECTION_STATUS.PRADITA_IN_PROGRESS ||
      status ===
        SELECTION_STATUS.PRADITA_COMPLETED ||
      status ===
        SELECTION_STATUS.FINAL_ANNOUNCED

    const allCompleted =
      status ===
        SELECTION_STATUS.PRADITA_COMPLETED ||
      status ===
        SELECTION_STATUS.FINAL_ANNOUNCED

    if (allCompleted) {
      peers =
        peers.map((peer) => ({
          ...peer,

          reviewStatus:
            REVIEW_STATUS.COMPLETED,
        }))
    }

    return {
      ...mockSelectionData,

      status,

      student: {
        ...mockSelectionData.student,

        name:
          oldStudent.name ||
          mockSelectionData.student.name,

        nim:
          oldStudent.nim ||
          mockSelectionData.student.nim,

        angkatan:
          oldStudent.angkatan ||
          mockSelectionData.student.angkatan,

        email:
          oldStudent.email ||
          mockSelectionData.student.email,

        ipk:
          oldStudent.ipk ??
          mockSelectionData.student.ipk,

        skpi:
          oldStudent.skpi ??
          mockSelectionData.student.skpi,
      },

      tahap1: {
        ...mockSelectionData.tahap1,

        rank:
          legacyRankingResult?.rank ??
          mockSelectionData.tahap1.rank,

        score:
          legacyRankingResult?.tahap1Score ??
          mockSelectionData.tahap1.score,

        prestasi:
          prestasiData,

        organisasi:
          organisasiData,

        bahasaAsing:
          bahasaData,
      },

      reviewers: {
        peers,

        kaprodi: {
          id:
            'kaprodi-si',

          name:
            'Kaprodi Sistem Informasi',

          status:
            REVIEW_STATUS.READY,

          reviewStatus:
            allCompleted
              ? REVIEW_STATUS.COMPLETED
              : REVIEW_STATUS.WAITING,
        },

        lecturer: {
          id:
            lecturerReady
              ? 'lecturer-demo'
              : null,

          name:
            lecturerReady
              ? 'Dosen Penilai'
              : null,

          status:
            lecturerReady
              ? REVIEW_STATUS.READY
              : REVIEW_STATUS.WAITING,

          reviewStatus:
            allCompleted
              ? REVIEW_STATUS.COMPLETED
              : lecturerReady
                ? REVIEW_STATUS.WAITING
                : null,
        },

        progress: {
          completed:
            legacyReviewerProgress
              ?.completed ??
            (
              allCompleted
                ? 5
                : status ===
                    SELECTION_STATUS.PRADITA_IN_PROGRESS
                  ? 3
                  : 0
            ),

          total:
            legacyReviewerProgress
              ?.total || 5,
        },
      },

      praditaValue: {
        score:
          legacyFinalResult
            ?.praditaValueScore ||
          null,
      },

      finalResult: {
        announced:
          status ===
          SELECTION_STATUS.FINAL_ANNOUNCED,

        rank:
          legacyFinalResult?.rank ||
          null,

        tahap1Score:
          legacyFinalResult
            ?.tahap1Score ||
          null,

        praditaValueScore:
          legacyFinalResult
            ?.praditaValueScore ||
          null,

        finalScore:
          legacyFinalResult
            ?.finalScore ||
          null,
      },
    }
  }

  /*
    =========================================================
    MAIN DATA SOURCE
    =========================================================
  */

  const selectionData =
    location.state?.selectionData ||
    createSelectionDataFromLegacy() ||
    mockSelectionData

  const student =
    selectionData.student

  const tahap1 =
    selectionData.tahap1

  const reviewers =
    selectionData.reviewers

  const finalResult =
    selectionData.finalResult

  const status =
    selectionData.status

  /*
    =========================================================
    STATUS
    =========================================================
  */

  const isNeedPeers =
    status ===
    SELECTION_STATUS.NEED_PEERS

  const isWaitingLecturer =
    status ===
    SELECTION_STATUS.WAITING_LECTURER

  const isPraditaInProgress =
    status ===
    SELECTION_STATUS.PRADITA_IN_PROGRESS

  const isPraditaCompleted =
    status ===
    SELECTION_STATUS.PRADITA_COMPLETED

  const isFinalAnnounced =
    status ===
    SELECTION_STATUS.FINAL_ANNOUNCED

  const praditaCompleted =
    isPraditaCompleted ||
    isFinalAnnounced

  /*
    =========================================================
    LABEL HELPERS
    =========================================================
  */

  const getPrestasiLevelLabel = (
    value
  ) => {
    const labels = {
      internasional:
        'Internasional',

      nasional:
        'Nasional',

      lokal:
        'Lokal',
    }

    return (
      labels[value] ||
      value ||
      '-'
    )
  }

  const getOrganisasiLevelLabel = (
    value
  ) => {
    const labels = {
      internasional:
        'Internasional',

      nasional:
        'Nasional',

      lokal:
        'Lokal / Kampus',
    }

    return (
      labels[value] ||
      value ||
      '-'
    )
  }

  const getJabatanLabel = (
    value
  ) => {
    const labels = {
      ketua:
        'Ketua',

      koordinator:
        'Koordinator Divisi',

      anggota:
        'Anggota',
    }

    return (
      labels[value] ||
      value ||
      '-'
    )
  }

  const getBahasaLabel = (
    value
  ) => {
    const labels = {
      inggris:
        'Bahasa Inggris',

      jepang:
        'Bahasa Jepang',

      korea:
        'Bahasa Korea',

      arab:
        'Bahasa Arab',
    }

    return (
      labels[value] ||
      value ||
      '-'
    )
  }

  /*
    =========================================================
    INDICATORS
    =========================================================
  */

  const indicators = [
    {
      id: 'ipk',

      title: 'IPK',

      value:
        `${student.ipk} / 4.00`,

      detail:
        'Data akademik',

      status:
        'verified',

      Icon:
        GraduationCap,
    },

    {
      id: 'skpi',

      title: 'SKPI',

      value:
        student.skpi,

      detail:
        'Data akademik',

      status:
        'verified',

      Icon:
        FileText,
    },

    {
      id: 'prestasi',

      title: 'Prestasi',

      value:
        tahap1.prestasi.submitted
          ? tahap1.prestasi.name
          : 'Tidak diajukan',

      detail:
        tahap1.prestasi.submitted
          ? getPrestasiLevelLabel(
              tahap1.prestasi.level
            )
          : '',

      status:
        tahap1.prestasi.submitted
          ? 'verified'
          : 'not-submitted',

      Icon:
        Trophy,
    },

    {
      id: 'organisasi',

      title: 'Organisasi',

      value:
        tahap1.organisasi.submitted
          ? tahap1.organisasi.name
          : 'Tidak diajukan',

      detail:
        tahap1.organisasi.submitted
          ? `${getOrganisasiLevelLabel(
              tahap1.organisasi.level
            )} • ${getJabatanLabel(
              tahap1.organisasi.position
            )}`
          : '',

      status:
        tahap1.organisasi.submitted
          ? 'verified'
          : 'not-submitted',

      Icon:
        Users,
    },

    {
      id: 'bahasa',

      title: 'Bahasa Asing',

      value:
        tahap1.bahasaAsing.submitted
          ? getBahasaLabel(
              tahap1.bahasaAsing.language
            )
          : 'Tidak diajukan',

      detail:
        tahap1.bahasaAsing.submitted
          ? `${tahap1.bahasaAsing.certificate} • Skor ${tahap1.bahasaAsing.score}`
          : '',

      status:
        tahap1.bahasaAsing.submitted
          ? 'verified'
          : 'not-submitted',

      Icon:
        Languages,
    },
  ]

  const renderIndicatorStatus = (
    indicatorStatus
  ) => {
    if (
      indicatorStatus === 'verified'
    ) {
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

  /*
    =========================================================
    NAVIGATION
    =========================================================
  */

  const handleOpenPeerForm = () => {
    navigate(
      '/pradita-value/rekan-sejawat',
      {
        state: {
          selectionData,

          registrationData,

          rankingResult: {
            rank:
              tahap1.rank,

            tahap1Score:
              formatScore(
                tahap1.score
              ),
          },

          peerInvitations:
            reviewers.peers,
        },
      }
    )
  }

  const handleViewPraditaStatus = () => {
    navigate(
      '/pradita-value/status',
      {
        state: {
          selectionData,

          registrationData,

          rankingResult: {
            rank:
              tahap1.rank,

            tahap1Score:
              formatScore(
                tahap1.score
              ),
          },

          peerInvitations:
            reviewers.peers,

          praditaStage:
            isNeedPeers
              ? 'need-peers'
              : isWaitingLecturer
                ? 'waiting-admin'
                : isPraditaInProgress
                  ? 'in-progress'
                  : isPraditaCompleted
                    ? 'completed'
                    : 'final-announced',

          reviewerProgress:
            reviewers.progress,

          finalResult,
        },
      }
    )
  }

  /*
    =========================================================
    DEMO ONLY
    =========================================================
  */

  const handleSimulateLecturerReady = () => {
    const updatedSelectionData = {
      ...selectionData,

      status:
        SELECTION_STATUS.PRADITA_IN_PROGRESS,

      reviewers: {
        ...reviewers,

        lecturer: {
          id:
            'lecturer-demo',

          name:
            'Dosen Penilai',

          status:
            REVIEW_STATUS.READY,

          reviewStatus:
            REVIEW_STATUS.COMPLETED,
        },

        peers:
          reviewers.peers.map(
            (peer, index) => ({
              ...peer,

              reviewStatus:
                index === 1
                  ? REVIEW_STATUS.WAITING
                  : REVIEW_STATUS.COMPLETED,
            })
          ),

        kaprodi: {
          ...reviewers.kaprodi,

          reviewStatus:
            REVIEW_STATUS.WAITING,
        },

        progress: {
          completed: 3,
          total: 5,
        },
      },
    }

    navigate(
      '/dashboard/finalis',
      {
        replace: true,

        state: {
          selectionData:
            updatedSelectionData,
        },
      }
    )
  }

  const handleSimulateAllCompleted = () => {
    const updatedSelectionData = {
      ...selectionData,

      status:
        SELECTION_STATUS.PRADITA_COMPLETED,

      reviewers: {
        ...reviewers,

        peers:
          reviewers.peers.map(
            (peer) => ({
              ...peer,

              reviewStatus:
                REVIEW_STATUS.COMPLETED,
            })
          ),

        kaprodi: {
          ...reviewers.kaprodi,

          reviewStatus:
            REVIEW_STATUS.COMPLETED,
        },

        lecturer: {
          ...reviewers.lecturer,

          id:
            reviewers.lecturer.id ||
            'lecturer-demo',

          name:
            reviewers.lecturer.name ||
            'Dosen Penilai',

          status:
            REVIEW_STATUS.READY,

          reviewStatus:
            REVIEW_STATUS.COMPLETED,
        },

        progress: {
          completed: 5,
          total: 5,
        },
      },
    }

    navigate(
      '/dashboard/finalis',
      {
        replace: true,

        state: {
          selectionData:
            updatedSelectionData,
        },
      }
    )
  }

  const handleSimulateFinalResult = () => {
    const updatedSelectionData = {
      ...selectionData,

      status:
        SELECTION_STATUS.FINAL_ANNOUNCED,

      reviewers: {
        ...reviewers,

        progress: {
          completed: 5,
          total: 5,
        },
      },

      praditaValue: {
        score: 91.2,
      },

      finalResult: {
        announced: true,

        rank: 2,

        tahap1Score:
          Number(tahap1.score),

        praditaValueScore:
          91.2,

        finalScore:
          88.8,
      },
    }

    navigate(
      '/dashboard/finalis',
      {
        replace: true,

        state: {
          selectionData:
            updatedSelectionData,
        },
      }
    )
  }

  /*
    =========================================================
    PROGRESS
    =========================================================
  */

  const progressPercentage =
    reviewers.progress.total > 0
      ? (
          reviewers.progress.completed /
          reviewers.progress.total
        ) * 100
      : 0

  return (
    <div className="finalis-dashboard-page">

      <div className="finalis-dashboard-container">

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

        {!isFinalAnnounced && (
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
                  Peringkat Tahap 1
                </span>

                <strong>
                  #{tahap1.rank}
                </strong>

              </div>

              <div>

                <span>
                  Nilai Tahap 1
                </span>

                <strong>
                  {formatScore(
                    tahap1.score
                  )}
                </strong>

              </div>

            </div>

          </section>
        )}

        {isFinalAnnounced &&
          finalResult.announced && (
            <section className="final-result-card">

              <div className="final-result-top">

                <div className="final-result-main">

                  <div className="final-result-icon">
                    <Medal size={26} />
                  </div>

                  <div>

                    <span className="final-result-label">
                      PENGUMUMAN FINAL
                    </span>

                    <h2>
                      Hasil Seleksi Mahasiswa
                      Berprestasi
                    </h2>

                    <p>
                      Seluruh rangkaian seleksi
                      Mahasiswa Berprestasi telah
                      selesai.
                    </p>

                  </div>

                </div>

                <span className="final-result-badge">
                  Hasil Dirilis
                </span>

              </div>

              <div className="final-result-ranking">

                <div className="final-result-ranking-icon">
                  <Award size={28} />
                </div>

                <div>

                  <span>
                    Peringkat Final
                  </span>

                  <strong>
                    Peringkat{' '}
                    {finalResult.rank}
                  </strong>

                  <p>
                    Mahasiswa Berprestasi
                    Sistem Informasi
                  </p>

                </div>

              </div>

              <div className="final-result-score-grid">

                <div>

                  <span>
                    Nilai Tahap 1
                  </span>

                  <strong>
                    {formatScore(
                      finalResult.tahap1Score
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Nilai Pradita Value
                  </span>

                  <strong>
                    {formatScore(
                      finalResult.praditaValueScore
                    )}
                  </strong>

                </div>

                <div className="final-result-score-primary">

                  <span>
                    Nilai Akhir
                  </span>

                  <strong>
                    {formatScore(
                      finalResult.finalScore
                    )}
                  </strong>

                </div>

              </div>

            </section>
          )}

        <div className="finalis-dashboard-grid">

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
                const Icon =
                  item.Icon

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

              <div
                className={
                  praditaCompleted
                    ? 'finalis-selection-step is-complete'
                    : 'finalis-selection-step is-current'
                }
              >

                <div className="finalis-selection-marker">

                  {praditaCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    3
                  )}

                </div>

                <div className="finalis-selection-copy">

                  <strong>
                    Pradita Value
                  </strong>

                  <span>

                    {isNeedPeers &&
                      'Lengkapi rekan sejawat'}

                    {isWaitingLecturer &&
                      'Menunggu dosen penilai'}

                    {isPraditaInProgress &&
                      'Sedang berlangsung'}

                    {praditaCompleted &&
                      'Selesai'}

                  </span>

                </div>

              </div>

              <div
                className={
                  praditaCompleted
                    ? 'finalis-selection-line is-complete'
                    : 'finalis-selection-line'
                }
              />

              <div
                className={
                  isFinalAnnounced
                    ? 'finalis-selection-step is-complete'
                    : isPraditaCompleted
                      ? 'finalis-selection-step is-current'
                      : 'finalis-selection-step'
                }
              >

                <div className="finalis-selection-marker">

                  {isFinalAnnounced ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    4
                  )}

                </div>

                <div className="finalis-selection-copy">

                  <strong>
                    Pengumuman Final
                  </strong>

                  <span>

                    {isFinalAnnounced
                      ? 'Hasil dirilis'
                      : isPraditaCompleted
                        ? 'Menunggu hasil'
                        : 'Belum tersedia'}

                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

        {isNeedPeers && (
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
                    untuk melengkapi penilai
                    Pradita Value.
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
                  Kaprodi SI
                </span>

                <strong className="finalis-success-text">
                  Sudah Ditentukan
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

            </div>

            <div className="finalis-pradita-bottom">

              <p>
                Anda hanya perlu mengisi email
                3 rekan sejawat. Kaprodi Sistem
                Informasi sudah tetap, sedangkan
                dosen penilai ditentukan oleh admin.
              </p>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={
                  handleOpenPeerForm
                }
              >
                Isi Email Rekan Sejawat
                <ArrowRight size={15} />
              </button>

            </div>

          </section>
        )}

        {isWaitingLecturer && (
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
                    Menunggu Dosen Penilai
                  </h2>

                  <p>
                    Rekan sejawat sudah diundang dan
                    Kaprodi Sistem Informasi sudah
                    tersedia. Admin masih menentukan
                    1 dosen penilai.
                  </p>

                </div>

              </div>

              <span className="finalis-pradita-status">
                Menunggu Dosen
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
                  Kaprodi Sistem Informasi
                </span>

                <strong className="finalis-success-text">
                  Sudah Ditentukan
                </strong>
              </div>

              <div>
                <span>
                  Dosen Penilai
                </span>

                <strong className="finalis-waiting-text">
                  Menunggu Admin
                </strong>
              </div>

            </div>

            <div className="finalis-pradita-bottom">

              <div className="finalis-waiting-admin">

                <Clock3 size={15} />

                <p>
                  Menunggu admin menentukan
                  1 dosen penilai.
                </p>

              </div>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={
                  handleViewPraditaStatus
                }
              >
                Lihat Status Penilaian
                <ArrowRight size={15} />
              </button>

            </div>

            {import.meta.env.DEV && (
              <div className="finalis-demo-area">

                <span>
                  Demo Frontend
                </span>

                <button
                  type="button"
                  onClick={
                    handleSimulateLecturerReady
                  }
                >
                  Simulasikan Dosen Siap
                </button>

              </div>
            )}

          </section>
        )}

        {isPraditaInProgress && (
          <section className="finalis-pradita-card finalis-pradita-progress-card">

            <div className="finalis-pradita-top">

              <div className="finalis-pradita-content">

                <div className="finalis-pradita-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <span className="finalis-pradita-label">
                    PRADITA VALUE
                  </span>

                  <h2>
                    Penilaian Pradita Value Sedang
                    Berlangsung
                  </h2>

                  <p>
                    Penilaian dilakukan oleh
                    3 rekan sejawat, Kaprodi Sistem
                    Informasi, dan 1 dosen penilai.
                  </p>

                </div>

              </div>

              <span className="finalis-pradita-status finalis-pradita-status-active">
                Sedang Berlangsung
              </span>

            </div>

            <div className="finalis-pradita-info">

              <div>
                <span>
                  Rekan Sejawat
                </span>

                <strong>
                  3 penilai
                </strong>
              </div>

              <div>
                <span>
                  Kaprodi SI
                </span>

                <strong>
                  1 penilai
                </strong>
              </div>

              <div>
                <span>
                  Dosen
                </span>

                <strong>
                  1 penilai
                </strong>
              </div>

            </div>

            <div className="finalis-progress-section">

              <div className="finalis-progress-heading">

                <span>
                  Progress Penilaian
                </span>

                <strong>
                  {reviewers.progress.completed}
                  {' '}
                  dari
                  {' '}
                  {reviewers.progress.total}
                  {' '}
                  penilai telah mengisi
                </strong>

              </div>

              <div className="finalis-progress-track">

                <div
                  className="finalis-progress-fill"
                  style={{
                    width:
                      `${progressPercentage}%`,
                  }}
                />

              </div>

              <p>
                Penilaian selesai setelah seluruh
                penilai mengirimkan hasil.
              </p>

            </div>

            <div className="finalis-pradita-bottom">

              <p>
                Status diperbarui ketika penilai
                mengirimkan penilaian.
              </p>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={
                  handleViewPraditaStatus
                }
              >
                Lihat Status Pradita Value
                <ArrowRight size={15} />
              </button>

            </div>

            {import.meta.env.DEV && (
              <div className="finalis-demo-area">

                <span>
                  Demo Frontend
                </span>

                <button
                  type="button"
                  onClick={
                    handleSimulateAllCompleted
                  }
                >
                  Simulasikan Semua Penilai Selesai
                </button>

              </div>
            )}

          </section>
        )}

        {isPraditaCompleted && (
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
                    Penilaian Pradita Value Selesai
                  </h2>

                  <p>
                    Seluruh penilai telah mengirimkan
                    hasil penilaian. Hasil akhir
                    sedang menunggu pengumuman.
                  </p>

                </div>

              </div>

              <span className="finalis-pradita-status finalis-pradita-status-success">

                <CheckCircle2 size={13} />
                5/5 Selesai

              </span>

            </div>

            <div className="finalis-pradita-info">

              <div>
                <span>
                  Rekan Sejawat
                </span>

                <strong className="finalis-success-text">
                  3/3 Selesai
                </strong>
              </div>

              <div>
                <span>
                  Kaprodi SI
                </span>

                <strong className="finalis-success-text">
                  Selesai
                </strong>
              </div>

              <div>
                <span>
                  Dosen Penilai
                </span>

                <strong className="finalis-success-text">
                  Selesai
                </strong>
              </div>

            </div>

            <div className="finalis-progress-section">

              <div className="finalis-progress-heading">

                <span>
                  Progress Penilaian
                </span>

                <strong>
                  5 dari 5 penilai telah mengisi
                </strong>

              </div>

              <div className="finalis-progress-track">

                <div
                  className="finalis-progress-fill"
                  style={{
                    width: '100%',
                  }}
                />

              </div>

              <p>
                Seluruh penilaian Pradita Value
                telah selesai.
              </p>

            </div>

            <div className="finalis-pradita-bottom">

              <div className="finalis-waiting-admin">

                <Clock3 size={15} />

                <p>
                  Menunggu pengumuman hasil final.
                </p>

              </div>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={
                  handleViewPraditaStatus
                }
              >
                Lihat Status Pradita Value
                <ArrowRight size={15} />
              </button>

            </div>

            {import.meta.env.DEV && (
              <div className="finalis-demo-area">

                <span>
                  Demo Frontend
                </span>

                <button
                  type="button"
                  onClick={
                    handleSimulateFinalResult
                  }
                >
                  Simulasikan Pengumuman Final
                </button>

              </div>
            )}

          </section>
        )}

        {isFinalAnnounced && (
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
                    Pradita Value Selesai
                  </h2>

                  <p>
                    Seluruh penilaian telah selesai
                    dan hasil final telah dirilis.
                  </p>

                </div>

              </div>

              <span className="finalis-pradita-status finalis-pradita-status-success">

                <CheckCircle2 size={13} />
                Selesai

              </span>

            </div>

            <div className="finalis-pradita-bottom">

              <p>
                Seluruh 5 penilai telah
                menyelesaikan penilaian.
              </p>

              <button
                type="button"
                className="finalis-peer-button"
                onClick={
                  handleViewPraditaStatus
                }
              >
                Lihat Riwayat Penilaian
                <ArrowRight size={15} />
              </button>

            </div>

          </section>
        )}

        <section className="finalis-information-card">

          <div className="finalis-card-heading">

            <div>

              <h2>
                Informasi Penting
              </h2>

              <p>
                Informasi untuk proses seleksi
                Mahasiswa Berprestasi.
              </p>

            </div>

          </div>

          <div className="finalis-information-list">

            {isFinalAnnounced ? (
              <>
                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Seluruh tahap seleksi telah
                    selesai.
                  </p>
                </div>

                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Hasil final Mahasiswa Berprestasi
                    telah dirilis.
                  </p>
                </div>

                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Nilai akhir berasal dari
                    penilaian Tahap 1 dan
                    Pradita Value.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="finalis-information-item">
                  <span className="finalis-information-dot" />

                  <p>
                    Anda telah lolos Tahap 1 dan
                    melanjutkan ke Pradita Value.
                  </p>
                </div>

                {isNeedPeers && (
                  <div className="finalis-information-item">

                    <span className="finalis-information-dot" />

                    <p>
                      Masukkan 3 email rekan sejawat
                      dengan domain
                      @student.pradita.ac.id.
                    </p>

                  </div>
                )}

                {isWaitingLecturer && (
                  <div className="finalis-information-item">

                    <span className="finalis-information-dot" />

                    <p>
                      Kaprodi Sistem Informasi sudah
                      tersedia dan proses sedang
                      menunggu dosen penilai.
                    </p>

                  </div>
                )}

                {isPraditaInProgress && (
                  <div className="finalis-information-item">

                    <span className="finalis-information-dot" />

                    <p>
                      Pradita Value sedang dinilai
                      oleh 3 rekan sejawat,
                      Kaprodi Sistem Informasi,
                      dan 1 dosen.
                    </p>

                  </div>
                )}

                {isPraditaCompleted && (
                  <div className="finalis-information-item">

                    <span className="finalis-information-dot" />

                    <p>
                      Seluruh penilaian Pradita Value
                      telah selesai. Hasil final belum
                      diumumkan.
                    </p>

                  </div>
                )}

                <div className="finalis-information-item">

                  <span className="finalis-information-dot" />

                  <p>
                    Hasil akhir ditampilkan setelah
                    pengumuman final dirilis.
                  </p>

                </div>
              </>
            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default DashboardFinalis