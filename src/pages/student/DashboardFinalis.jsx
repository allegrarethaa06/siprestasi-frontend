import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Languages,
  Trophy,
  Users,
} from 'lucide-react'

import mockSelectionData, {
  REVIEW_STATUS,
  SELECTION_STATUS,
} from '../../data/mockSelectionData'

import FinalAnnouncement from '../../components/student/FinalAnnouncement'
import '../../styles/student/dashboard-finalis.css'

const scoreText = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const number = Number(value)
  return Number.isFinite(number) ? number.toFixed(2) : String(value)
}

const labelFrom = (labels, value) => labels[value] || value || '-'

const PRESTASI_LEVELS = {
  internasional: 'Internasional',
  nasional: 'Nasional',
  lokal: 'Lokal',
}

const ORGANIZATION_LEVELS = {
  internasional: 'Internasional',
  nasional: 'Nasional',
  provinsi: 'Provinsi',
  'kabupaten-kota': 'Kabupaten / Kota',
  kecamatan: 'Kecamatan',
  kampus: 'Kampus',
  sekolah: 'Sekolah',
  lokal: 'Lokal / Kampus',
}

const ORGANIZATION_ROLES = {
  ketua: 'Ketua',
  'wakil-ketua': 'Wakil Ketua',
  sekretaris: 'Sekretaris',
  bendahara: 'Bendahara',
  'koordinator-divisi': 'Koordinator Divisi',
  koordinator: 'Koordinator Divisi',
  anggota: 'Anggota',
}

const LANGUAGES = {
  inggris: 'Bahasa Inggris',
  jepang: 'Bahasa Jepang',
  korea: 'Bahasa Korea',
  arab: 'Bahasa Arab',
}

const LEGACY_STAGES = {
  'need-peers': SELECTION_STATUS.NEED_PEERS,
  'waiting-admin': SELECTION_STATUS.WAITING_LECTURER,
  'in-progress': SELECTION_STATUS.PRADITA_IN_PROGRESS,
  completed: SELECTION_STATUS.PRADITA_COMPLETED,
  'final-announced': SELECTION_STATUS.FINAL_ANNOUNCED,
}

function convertLegacyData(routeState) {
  const {
    registrationData,
    rankingResult,
    peerInvitations,
    praditaStage,
    reviewerProgress,
    finalResult,
  } = routeState || {}

  if (
    !registrationData && !rankingResult && !peerInvitations &&
    !praditaStage && !reviewerProgress && !finalResult
  ) return null

  const oldStudent = registrationData?.student || {}
  const form = registrationData?.formData || {}
  const base = mockSelectionData

  const status = LEGACY_STAGES[praditaStage] || (
    peerInvitations?.length === 3
      ? SELECTION_STATUS.WAITING_LECTURER
      : SELECTION_STATUS.NEED_PEERS
  )

  const lecturerReady = [
    SELECTION_STATUS.PRADITA_IN_PROGRESS,
    SELECTION_STATUS.PRADITA_COMPLETED,
    SELECTION_STATUS.FINAL_ANNOUNCED,
  ].includes(status)

  const completed = [
    SELECTION_STATUS.PRADITA_COMPLETED,
    SELECTION_STATUS.FINAL_ANNOUNCED,
  ].includes(status)

  const submitted = (value, fallback) =>
    value === 'ya' ? true : value === 'tidak' ? false : fallback

  const prestasiSubmitted = submitted(form.hasPrestasi, base.tahap1.prestasi.submitted)
  const organisasiSubmitted = submitted(form.hasOrganisasi, base.tahap1.organisasi.submitted)
  const bahasaSubmitted = submitted(form.hasBahasa, base.tahap1.bahasaAsing.submitted)

  let peers = []

  if (peerInvitations?.length > 0) {
    peers = peerInvitations.map((peer, index) => ({
      id: peer.id || index + 1,
      email: peer.email || `rekan.${index + 1}@student.pradita.ac.id`,
      invitationStatus: REVIEW_STATUS.INVITED,
      reviewStatus: completed ? REVIEW_STATUS.COMPLETED : REVIEW_STATUS.WAITING,
    }))
  } else if (status !== SELECTION_STATUS.NEED_PEERS) {
    peers = (base.reviewers?.peers || []).map((peer) => ({
      ...peer,
      reviewStatus: completed ? REVIEW_STATUS.COMPLETED : peer.reviewStatus,
    }))
  }

  return {
    ...base,
    status,
    student: {
      ...base.student,
      name: oldStudent.name || base.student.name,
      nim: oldStudent.nim || base.student.nim,
      angkatan: oldStudent.angkatan || base.student.angkatan,
      email: oldStudent.email || base.student.email,
      ipk: oldStudent.ipk ?? base.student.ipk,
      skpi: oldStudent.skpi ?? base.student.skpi,
      photo: oldStudent.photo || oldStudent.photoUrl || null,
    },
    tahap1: {
      ...base.tahap1,
      rank: rankingResult?.rank ?? base.tahap1.rank,
      score: rankingResult?.tahap1Score ?? base.tahap1.score,
      prestasi: {
        submitted: prestasiSubmitted,
        name: prestasiSubmitted ? form.namaPrestasi || base.tahap1.prestasi.name : null,
        level: prestasiSubmitted ? form.tingkatPrestasi || base.tahap1.prestasi.level : null,
        verificationStatus: prestasiSubmitted ? 'verified' : null,
      },
      organisasi: {
        submitted: organisasiSubmitted,
        name: organisasiSubmitted ? form.namaOrganisasi || base.tahap1.organisasi.name : null,
        level: organisasiSubmitted ? form.tingkatOrganisasi || base.tahap1.organisasi.level : null,
        position: organisasiSubmitted ? form.jabatan || base.tahap1.organisasi.position : null,
        verificationStatus: organisasiSubmitted ? 'verified' : null,
      },
      bahasaAsing: {
        submitted: bahasaSubmitted,
        language: bahasaSubmitted ? form.bahasa || base.tahap1.bahasaAsing.language : null,
        certificate: bahasaSubmitted ? form.tingkatSertifikat || base.tahap1.bahasaAsing.certificate : null,
        score: bahasaSubmitted ? form.skor || base.tahap1.bahasaAsing.score : null,
        verificationStatus: bahasaSubmitted ? 'verified' : null,
      },
    },
    reviewers: {
      peers,
      kaprodi: {
        id: 'kaprodi-si',
        name: 'Kaprodi Sistem Informasi',
        status: REVIEW_STATUS.READY,
        reviewStatus: completed ? REVIEW_STATUS.COMPLETED : REVIEW_STATUS.WAITING,
      },
      lecturer: {
        id: lecturerReady ? 'lecturer-demo' : null,
        name: lecturerReady ? 'Dosen Penilai' : null,
        status: lecturerReady ? REVIEW_STATUS.READY : REVIEW_STATUS.WAITING,
        reviewStatus: completed
          ? REVIEW_STATUS.COMPLETED
          : lecturerReady ? REVIEW_STATUS.WAITING : null,
      },
      progress: {
        completed: reviewerProgress?.completed ?? (
          completed ? 5 : status === SELECTION_STATUS.PRADITA_IN_PROGRESS ? 3 : 0
        ),
        total: reviewerProgress?.total || 5,
      },
    },
    praditaValue: { score: finalResult?.praditaValueScore || null },
    finalResult: {
      announced: status === SELECTION_STATUS.FINAL_ANNOUNCED,
      rank: finalResult?.rank || null,
      tahap1Score: finalResult?.tahap1Score || null,
      praditaValueScore: finalResult?.praditaValueScore || null,
      finalScore: finalResult?.finalScore || null,
    },
  }
}

function DashboardFinalis() {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = location.state || {}

  const selectionData = routeState.selectionData || convertLegacyData(routeState) || mockSelectionData
  const { student, tahap1, reviewers, finalResult, status } = selectionData

  const isNeedPeers = status === SELECTION_STATUS.NEED_PEERS
  const isWaitingLecturer = status === SELECTION_STATUS.WAITING_LECTURER
  const isPraditaInProgress = status === SELECTION_STATUS.PRADITA_IN_PROGRESS
  const isPraditaCompleted = status === SELECTION_STATUS.PRADITA_COMPLETED
  const isFinalAnnounced = status === SELECTION_STATUS.FINAL_ANNOUNCED
  const praditaCompleted = isPraditaCompleted || isFinalAnnounced

  const indicators = [
    {
      id: 'ipk', title: 'IPK', value: `${student.ipk} / 4.00`,
      detail: 'Data akademik', status: 'verified', Icon: GraduationCap,
    },
    {
      id: 'skpi', title: 'SKPI', value: student.skpi,
      detail: 'Data akademik', status: 'verified', Icon: FileText,
    },
    {
      id: 'prestasi', title: 'Prestasi',
      value: tahap1.prestasi.submitted ? tahap1.prestasi.name : 'Tidak diajukan',
      detail: tahap1.prestasi.submitted
        ? labelFrom(PRESTASI_LEVELS, tahap1.prestasi.level) : '',
      status: tahap1.prestasi.submitted ? 'verified' : 'not-submitted',
      Icon: Trophy,
    },
    {
      id: 'organisasi', title: 'Organisasi',
      value: tahap1.organisasi.submitted ? tahap1.organisasi.name : 'Tidak diajukan',
      detail: tahap1.organisasi.submitted
        ? `${labelFrom(ORGANIZATION_LEVELS, tahap1.organisasi.level)} • ${labelFrom(ORGANIZATION_ROLES, tahap1.organisasi.position)}`
        : '',
      status: tahap1.organisasi.submitted ? 'verified' : 'not-submitted',
      Icon: Users,
    },
    {
      id: 'bahasa', title: 'Bahasa Asing',
      value: tahap1.bahasaAsing.submitted
        ? labelFrom(LANGUAGES, tahap1.bahasaAsing.language) : 'Tidak diajukan',
      detail: tahap1.bahasaAsing.submitted
        ? `${tahap1.bahasaAsing.certificate} • Skor ${tahap1.bahasaAsing.score}` : '',
      status: tahap1.bahasaAsing.submitted ? 'verified' : 'not-submitted',
      Icon: Languages,
    },
  ]

  // Nilai ini untuk menampilkan demo saat data finalis lengkap belum tersedia.
  const fallbackScores = { 1: 92.4, 2: 88.8, 3: 86.75 }

  const createFallbackFinalist = (rank) => {
    if (Number(finalResult.rank) === rank) {
      return {
        rank, name: student.name, nim: student.nim,
        angkatan: student.angkatan,
        photo: student.photo || student.photoUrl || null,
        finalScore: finalResult.finalScore,
        isCurrent: true,
      }
    }
    return {
      rank, name: `Finalis Peringkat ${rank}`,
      nim: '241010XXXX', angkatan: student.angkatan,
      photo: null, finalScore: fallbackScores[rank], isCurrent: false,
    }
  }

  const sourceFinalists = Array.isArray(selectionData.finalists) && selectionData.finalists.length >= 3
    ? selectionData.finalists
    : [1, 2, 3].map(createFallbackFinalist)

  const finalists = [1, 2, 3].map((rank) => {
    const source = sourceFinalists.find((item) => Number(item.rank) === rank) || createFallbackFinalist(rank)
    return {
      rank,
      name: source.name || `Finalis Peringkat ${rank}`,
      nim: source.nim || '-',
      angkatan: source.angkatan || '-',
      photo: source.photo || source.photoUrl || null,
      finalScore: source.finalScore ?? source.score ?? fallbackScores[rank],
      isCurrent: String(source.nim) === String(student.nim) || (
        Number(finalResult.rank) === rank && source.name === student.name
      ),
    }
  })

  const handleOpenPeerForm = () => navigate('/pradita-value/rekan-sejawat', {
    state: {
      selectionData,
      registrationData: routeState.registrationData || null,
      rankingResult: { rank: tahap1.rank, tahap1Score: scoreText(tahap1.score) },
      peerInvitations: reviewers.peers,
    },
  })

  const handleViewPraditaStatus = () => navigate('/pradita-value/status', {
    state: {
      selectionData,
      registrationData: routeState.registrationData || null,
      rankingResult: { rank: tahap1.rank, tahap1Score: scoreText(tahap1.score) },
      peerInvitations: reviewers.peers,
      praditaStage: isNeedPeers ? 'need-peers'
        : isWaitingLecturer ? 'waiting-admin'
          : isPraditaInProgress ? 'in-progress'
            : isPraditaCompleted ? 'completed' : 'final-announced',
      reviewerProgress: reviewers.progress,
      finalResult,
    },
  })

  // Simulasi ini hanya aktif selama development.
  const replaceDemoState = (nextSelectionData) => navigate('/dashboard/finalis', {
    replace: true,
    state: { selectionData: nextSelectionData },
  })

  const handleSimulateLecturerReady = () => replaceDemoState({
    ...selectionData,
    status: SELECTION_STATUS.PRADITA_IN_PROGRESS,
    reviewers: {
      ...reviewers,
      lecturer: {
        id: 'lecturer-demo', name: 'Dosen Penilai',
        status: REVIEW_STATUS.READY, reviewStatus: REVIEW_STATUS.COMPLETED,
      },
      peers: reviewers.peers.map((peer, index) => ({
        ...peer,
        reviewStatus: index === 1 ? REVIEW_STATUS.WAITING : REVIEW_STATUS.COMPLETED,
      })),
      kaprodi: { ...reviewers.kaprodi, reviewStatus: REVIEW_STATUS.WAITING },
      progress: { completed: 3, total: 5 },
    },
  })

  const handleSimulateAllCompleted = () => replaceDemoState({
    ...selectionData,
    status: SELECTION_STATUS.PRADITA_COMPLETED,
    reviewers: {
      ...reviewers,
      peers: reviewers.peers.map((peer) => ({ ...peer, reviewStatus: REVIEW_STATUS.COMPLETED })),
      kaprodi: { ...reviewers.kaprodi, reviewStatus: REVIEW_STATUS.COMPLETED },
      lecturer: {
        ...reviewers.lecturer,
        id: reviewers.lecturer.id || 'lecturer-demo',
        name: reviewers.lecturer.name || 'Dosen Penilai',
        status: REVIEW_STATUS.READY, reviewStatus: REVIEW_STATUS.COMPLETED,
      },
      progress: { completed: 5, total: 5 },
    },
  })

  const handleSimulateFinalResult = () => replaceDemoState({
    ...selectionData,
    status: SELECTION_STATUS.FINAL_ANNOUNCED,
    reviewers: { ...reviewers, progress: { completed: 5, total: 5 } },
    praditaValue: { score: 91.2 },
    finalResult: {
      announced: true, rank: 2,
      tahap1Score: Number(tahap1.score),
      praditaValueScore: 91.2, finalScore: 88.8,
    },
  })

  const completedPeerCount = reviewers.peers.filter(
    (peer) => peer.reviewStatus === REVIEW_STATUS.COMPLETED
  ).length
  const kaprodiCompleted = reviewers.kaprodi?.reviewStatus === REVIEW_STATUS.COMPLETED
  const lecturerCompleted = reviewers.lecturer?.reviewStatus === REVIEW_STATUS.COMPLETED
  const progressPercentage = reviewers.progress.total > 0
    ? (reviewers.progress.completed / reviewers.progress.total) * 100 : 0

  const reviewerInfos = [
    { label: 'Rekan Sejawat', value: isNeedPeers ? '3 mahasiswa'
      : isWaitingLecturer ? '3 Undangan Terkirim' : `${completedPeerCount} dari 3 selesai`,
      status: isWaitingLecturer || completedPeerCount === 3 ? 'finalis-success-text' : '' },
    { label: 'Kaprodi Sistem Informasi', value: isNeedPeers || isWaitingLecturer
      ? 'Sudah Ditentukan' : kaprodiCompleted ? 'Selesai' : 'Menunggu',
      status: isNeedPeers || isWaitingLecturer || kaprodiCompleted
        ? 'finalis-success-text' : 'finalis-waiting-text' },
    { label: 'Dosen Penilai', value: isNeedPeers ? 'Ditentukan Admin'
      : isWaitingLecturer ? 'Menunggu Admin' : lecturerCompleted ? 'Selesai' : 'Menunggu',
      status: isNeedPeers ? ''
        : lecturerCompleted ? 'finalis-success-text' : 'finalis-waiting-text' },
  ]

  const informationMessages = isNeedPeers
    ? ['Masukkan 3 email rekan sejawat dengan domain @student.pradita.ac.id.', 'Hasil akhir tersedia setelah seluruh proses seleksi selesai.']
    : isWaitingLecturer
      ? ['Dosen penilai ditentukan oleh admin.', 'Penilaian dimulai setelah seluruh penilai tersedia.']
      : isPraditaInProgress
        ? ['Nilai Pradita Value belum ditampilkan selama proses penilaian berlangsung.', 'Hasil akhir tersedia setelah pengumuman final dirilis.']
        : ['Seluruh penilaian Pradita Value telah selesai.', 'Hasil final masih menunggu pengumuman.']

  return (
    <div className="finalis-dashboard-page">
      <div className="finalis-dashboard-container">
        <header className="finalis-page-header">
          <div>
            <span className="finalis-page-eyebrow">MAHASISWA BERPRESTASI</span>
            <h1>Seleksi Mahasiswa Berprestasi</h1>
            <p>Pantau hasil seleksi dan tahapan berikutnya.</p>
          </div>
        </header>

        {isFinalAnnounced && finalResult.announced && (
          <>
            <FinalAnnouncement
              selectionData={selectionData}
              finalists={finalists}
              student={student}
              finalResult={finalResult}
              onViewHistory={handleViewPraditaStatus}
            />

            <section className="final-stage-card">
              <div className="finalis-card-heading">
                <h2>Tahap Seleksi</h2>
                <p>Seluruh proses seleksi telah selesai.</p>
              </div>
              <div className="final-stage-list">
                {[
                  ['Tahap 1', 'Selesai'],
                  ['Ranking per Angkatan', 'Lolos Top 3'],
                  ['Pradita Value', 'Selesai'],
                  ['Pengumuman Final', 'Hasil dirilis'],
                ].map(([name, text], index) => (
                  <div key={name} style={{ display: 'contents' }}>
                    {index > 0 && <div className="final-stage-divider" />}
                    <div className="final-stage-item">
                      <CheckCircle2 size={18} />
                      <div><strong>{name}</strong><span>{text}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {!isFinalAnnounced && (
          <>
            <section className="finalis-result-card">
              <div className="finalis-result-main">
                <div className="finalis-result-icon"><Trophy size={22} /></div>
                <div>
                  <span className="finalis-result-label">LOLOS TAHAP 1</span>
                  <h2>Selamat, Anda Masuk Top 3 Angkatan {student.angkatan}</h2>
                  <p>Anda berhasil melanjutkan ke tahap Pradita Value.</p>
                </div>
              </div>
              <div className="finalis-result-stats">
                <div><span>Peringkat Tahap 1</span><strong>#{tahap1.rank}</strong></div>
                <div><span>Nilai Tahap 1</span><strong>{scoreText(tahap1.score)}</strong></div>
              </div>
            </section>

            <div className="finalis-dashboard-grid">
              <section className="finalis-summary-card">
                <div className="finalis-card-heading">
                  <h2>Ringkasan Tahap 1</h2>
                  <p>Data yang digunakan dalam penilaian Tahap 1.</p>
                </div>
                <div className="finalis-indicator-list">
                  {indicators.map(({ id, title, value, detail, status: indicatorStatus, Icon }) => (
                    <article className="finalis-indicator-row" key={id}>
                      <div className="finalis-indicator-icon"><Icon size={18} /></div>
                      <div className="finalis-indicator-content">
                        <span>{title}</span>
                        <strong>{value}</strong>
                        {detail && <small>{detail}</small>}
                      </div>
                      <div className="finalis-indicator-action">
                        {indicatorStatus === 'verified' ? (
                          <span className="finalis-indicator-status finalis-status-verified">
                            <CheckCircle2 size={13} /> Terverifikasi
                          </span>
                        ) : (
                          <span className="finalis-indicator-status finalis-status-neutral">
                            Tidak Diajukan
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="finalis-selection-card">
                <div className="finalis-card-heading">
                  <h2>Tahap Seleksi</h2>
                  <p>Posisi Anda dalam proses seleksi.</p>
                </div>
                <div className="finalis-selection-timeline">
                  <div className="finalis-selection-step is-complete">
                    <div className="finalis-selection-marker"><CheckCircle2 size={16} /></div>
                    <div className="finalis-selection-copy"><strong>Tahap 1</strong><span>Selesai</span></div>
                  </div>
                  <div className="finalis-selection-line is-complete" />
                  <div className="finalis-selection-step is-complete">
                    <div className="finalis-selection-marker"><CheckCircle2 size={16} /></div>
                    <div className="finalis-selection-copy"><strong>Ranking per Angkatan</strong><span>Lolos Top 3</span></div>
                  </div>
                  <div className="finalis-selection-line is-complete" />
                  <div className={`finalis-selection-step ${praditaCompleted ? 'is-complete' : 'is-current'}`}>
                    <div className="finalis-selection-marker">
                      {praditaCompleted ? <CheckCircle2 size={16} /> : 3}
                    </div>
                    <div className="finalis-selection-copy">
                      <strong>Pradita Value</strong>
                      <span>{isNeedPeers ? 'Lengkapi rekan sejawat'
                        : isWaitingLecturer ? 'Persiapan penilaian'
                          : isPraditaInProgress ? 'Sedang berlangsung' : 'Selesai'}</span>
                    </div>
                  </div>
                  <div className={`finalis-selection-line ${praditaCompleted ? 'is-complete' : ''}`} />
                  <div className={`finalis-selection-step ${isPraditaCompleted ? 'is-current' : ''}`}>
                    <div className="finalis-selection-marker">4</div>
                    <div className="finalis-selection-copy">
                      <strong>Pengumuman Final</strong>
                      <span>{isPraditaCompleted ? 'Menunggu hasil' : 'Belum tersedia'}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {isNeedPeers && (
              <section className="finalis-pradita-card">
                <div className="finalis-pradita-simple-heading">
                  <span className="finalis-pradita-label">PRADITA VALUE</span>
                  <h2>Lengkapi Rekan Sejawat</h2>
                  <p>Masukkan email 3 rekan sejawat untuk melengkapi penilai Pradita Value.</p>
                </div>
                <div className="finalis-pradita-info">
                  {reviewerInfos.map((info) => (
                    <div key={info.label}>
                      <span>{info.label}</span>
                      <strong className={info.status}>{info.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="finalis-pradita-bottom">
                  <p>Anda hanya perlu mengisi email 3 rekan sejawat.</p>
                  <button type="button" className="finalis-peer-button" onClick={handleOpenPeerForm}>
                    Isi Email Rekan Sejawat <ArrowRight size={15} />
                  </button>
                </div>
              </section>
            )}

            {(isWaitingLecturer || isPraditaInProgress) && (
              <section className="finalis-pradita-card">
                <div className="finalis-pradita-simple-heading">
                  <span className="finalis-pradita-label">PRADITA VALUE</span>
                  <h2>{isWaitingLecturer ? 'Pradita Value' : 'Penilaian Sedang Berlangsung'}</h2>
                  <p>{isWaitingLecturer
                    ? 'Pantau status penilai untuk proses Pradita Value.'
                    : `${reviewers.progress.completed} dari ${reviewers.progress.total} penilai telah menyelesaikan penilaian.`}</p>
                </div>
                <div className="finalis-pradita-info">
                  {reviewerInfos.map((info) => (
                    <div key={info.label}>
                      <span>{info.label}</span>
                      <strong className={info.status}>{info.value}</strong>
                    </div>
                  ))}
                </div>
                {isPraditaInProgress && (
                  <div className="finalis-progress-section">
                    <div className="finalis-progress-heading">
                      <span>Progress Penilaian</span>
                      <strong>{reviewers.progress.completed} / {reviewers.progress.total}</strong>
                    </div>
                    <div className="finalis-progress-track">
                      <div className="finalis-progress-fill" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <p>Penilaian selesai setelah seluruh penilai mengirimkan hasil.</p>
                  </div>
                )}
                <div className="finalis-pradita-bottom finalis-pradita-bottom-action-only">
                  <button type="button" className="finalis-peer-button" onClick={handleViewPraditaStatus}>
                    Lihat Status Penilaian <ArrowRight size={15} />
                  </button>
                </div>
              </section>
            )}

            {isPraditaCompleted && (
              <section className="finalis-pradita-card finalis-pradita-completed-card">
                <div className="finalis-pradita-completed-main">
                  <div className="finalis-pradita-completed-icon"><CheckCircle2 size={19} /></div>
                  <div>
                    <span className="finalis-pradita-label">PRADITA VALUE</span>
                    <h2>Penilaian Pradita Value Selesai</h2>
                    <p>Seluruh 5 penilai telah menyelesaikan penilaian. Hasil final belum dirilis.</p>
                  </div>
                </div>
                <button type="button" className="finalis-peer-button" onClick={handleViewPraditaStatus}>
                  Lihat Status Penilaian <ArrowRight size={15} />
                </button>
              </section>
            )}

            {import.meta.env.DEV && (isWaitingLecturer || isPraditaInProgress || isPraditaCompleted) && (
              <div className="finalis-demo-area">
                <span>Demo Frontend</span>
                {isWaitingLecturer && (
                  <button type="button" onClick={handleSimulateLecturerReady}>Simulasikan Dosen Siap</button>
                )}
                {isPraditaInProgress && (
                  <button type="button" onClick={handleSimulateAllCompleted}>Simulasikan Semua Penilai Selesai</button>
                )}
                {isPraditaCompleted && (
                  <button type="button" onClick={handleSimulateFinalResult}>Simulasikan Pengumuman Final</button>
                )}
              </div>
            )}

            <section className="finalis-information-card">
              <div className="finalis-card-heading">
                <h2>Informasi Penting</h2>
                <p>Informasi untuk proses seleksi Mahasiswa Berprestasi.</p>
              </div>
              <div className="finalis-information-list">
                {informationMessages.map((message) => (
                  <div className="finalis-information-item" key={message}>
                    <span className="finalis-information-dot" />
                    <p>{message}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardFinalis