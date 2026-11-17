import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Mail,
  Send,
  UserCheck,
  Users,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import {
  fetchDosenList,
  fetchSubmissionDetail,
  sendPvInvitations,
  setLecturers,
} from '../../data/admin'

import './DetailPraditaValue.css'

function createEvaluators(serverDetail, angkatan) {
  if (!serverDetail) return []
  const rev = serverDetail.reviewers || {}
  const responses = rev.responses || []
  const respByReviewer = {}
  responses.forEach((r) => {
    if (r.reviewer) respByReviewer[r.reviewer] = r
    if (r.role) respByReviewer[r.role] = r
  })

  const peers = [rev.peer_1, rev.peer_2, rev.peer_3]
  const peerEvaluators = [0, 1, 2].map((index) => {
    const peerEmail = peers[index]
    const resp = peerEmail
      ? respByReviewer[peerEmail] ||
        responses.find((r) => r.role === `peer_${index + 1}`)
      : null
    const sent = !!resp
    const responded = resp?.status === 'submitted'
    return {
      id: `peer-${index + 1}`,
      type: 'Rekan Sejawat',
      role: `Rekan Sejawat ${index + 1}`,
      name: peerEmail
        ? peerEmail.split('@')[0]
        : 'Belum diajukan mahasiswa',
      email: peerEmail || '-',
      token: resp?.token
        ? `PV-${angkatan || ''}-${resp.token.slice(0, 6).toUpperCase()}`
        : '-',
      sent,
      responded,
    }
  })

  const lecturers = rev.lecturers || []
  const lecturerEvaluators = [0, 1].map((index) => {
    const lec = lecturers[index]
    const resp = lec
      ? respByReviewer[lec.email] ||
        responses.find((r) => r.role === `dosen_${index + 1}`)
      : null
    const sent = !!resp
    const responded = resp?.status === 'submitted'
    return {
      id: `lecturer-${index + 1}`,
      type: 'Dosen',
      role: lec?.is_kaprodi
        ? 'Kaprodi Sistem Informasi'
        : index === 0
          ? 'Kaprodi Sistem Informasi'
          : 'Dosen Penilai',
      name:
        lec?.name ||
        (index === 0
          ? 'Belum dipilih (Kaprodi)'
          : 'Belum dipilih (Dosen Penilai)'),
      email: lec?.email || '-',
      token: resp?.token
        ? `PV-${angkatan || ''}-${resp.token.slice(0, 6).toUpperCase()}`
        : '-',
      sent,
      responded,
    }
  })

  return [...peerEvaluators, ...lecturerEvaluators]
}

function DetailPraditaValue() {
  const navigate = useNavigate()
  const { nim } = useParams()

  const [serverDetail, setServerDetail] = useState(null)
  const [evaluators, setEvaluators] = useState([])
  const [dosenList, setDosenList] = useState([])
  const [selectedKaprodiId, setSelectedKaprodiId] = useState('')
  const [selectedDosen2Id, setSelectedDosen2Id] = useState('')
  const [savingDosen, setSavingDosen] = useState(false)

  const [selectedEvaluator, setSelectedEvaluator] = useState(null)
  const [showSendAllModal, setShowSendAllModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadDetail = () => {
    if (!nim) return
    fetchSubmissionDetail(nim)
      .then((res) => {
        if (res?.data) {
          setServerDetail(res.data)
          setEvaluators(createEvaluators(res.data, res.data.angkatan))
          const lecs = res.data.reviewers?.lecturers || []
          if (lecs[0]?.user_id) setSelectedKaprodiId(String(lecs[0].user_id))
          if (lecs[1]?.user_id) setSelectedDosen2Id(String(lecs[1].user_id))
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    loadDetail()
    fetchDosenList()
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setDosenList(res.data)
          const kap = res.data.find((d) => Number(d.is_kaprodi) === 1)
          if (kap) {
            setSelectedKaprodiId((prev) => prev || String(kap.user_id))
          }
        }
      })
      .catch(() => {})
  }, [nim])

  const finalist = useMemo(() => {
    if (!serverDetail) {
      return {
        initials: 'M',
        name: '-',
        nim: nim || '',
        prodi: 'Sistem Informasi',
        angkatan: '-',
        tahap1: '0.00',
        status: 'Menunggu Data Rekan Sejawat',
        statusType: 'waiting',
        responseCount: 0,
      }
    }
    const responses = serverDetail.reviewers?.responses || []
    const submittedCount = responses.filter(
      (r) => r.status === 'submitted'
    ).length
    const sentCount = responses.length
    const rev = serverDetail.reviewers || {}
    const peersCount = [rev.peer_1, rev.peer_2, rev.peer_3].filter(
      Boolean
    ).length
    const lecturerCount = (rev.lecturers || []).length

    let status = 'Menunggu Data Rekan Sejawat'
    let statusType = 'waiting'
    if (submittedCount >= 5 && sentCount >= 5) {
      status = 'Selesai'
      statusType = 'completed'
    } else if (sentCount > 0) {
      status = 'Penilaian Berlangsung'
      statusType = 'progress'
    } else if (peersCount === 3 && lecturerCount >= 2) {
      status = 'Siap Dikirim'
      statusType = 'ready'
    }

    return {
      initials: serverDetail.initials || 'M',
      name: serverDetail.name || '-',
      nim: serverDetail.nim || '',
      prodi: 'Sistem Informasi',
      angkatan: serverDetail.angkatan || '-',
      tahap1: serverDetail.score?.total_score
        ? Number(serverDetail.score.total_score).toFixed(2)
        : '0.00',
      status,
      statusType,
      responseCount: submittedCount,
    }
  }, [serverDetail, nim])

  const peers = evaluators.filter((item) => item.type === 'Rekan Sejawat')
  const lecturers = evaluators.filter((item) => item.type === 'Dosen')
  const sentCount = evaluators.filter((item) => item.sent).length
  const responseCount = evaluators.filter((item) => item.responded).length

  const peersComplete =
    peers.filter((item) => item.email && item.email !== '-').length === 3
  const lecturersComplete =
    lecturers.filter((item) => item.email && item.email !== '-').length === 2

  const canSendAll = peersComplete && lecturersComplete && sentCount < 5

  const handleSaveLecturers = async () => {
    if (!serverDetail?.sub_id) return
    if (!selectedKaprodiId || !selectedDosen2Id) {
      setErrorMessage('Pilih Kaprodi dan Dosen Penilai terlebih dahulu.')
      return
    }
    if (selectedKaprodiId === selectedDosen2Id) {
      setErrorMessage('Kaprodi dan Dosen Penilai kedua tidak boleh sama.')
      return
    }

    setSavingDosen(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      await setLecturers(serverDetail.sub_id, {
        lecturer_reviewer_1: Number(selectedKaprodiId),
        lecturer_reviewer_2: Number(selectedDosen2Id),
      })
      setSuccessMessage('Dosen penilai berhasil disimpan.')
      loadDetail()
    } catch (err) {
      setErrorMessage(err?.message || 'Gagal menyimpan dosen penilai.')
    } finally {
      setSavingDosen(false)
    }
  }

  const handleSendAll = async () => {
    if (!serverDetail?.sub_id) return
    setErrorMessage('')
    try {
      await sendPvInvitations(serverDetail.sub_id)
      setShowSendAllModal(false)
      setSuccessMessage(
        'Form Pradita Value berhasil dikirim ke seluruh penilai.'
      )
      loadDetail()
    } catch (err) {
      setShowSendAllModal(false)
      setErrorMessage(
        err?.message || 'Gagal mengirim form Pradita Value.'
      )
    }
  }

  const handleSendSingle = async () => {
    if (!selectedEvaluator || !serverDetail?.sub_id) return
    setErrorMessage('')
    try {
      await sendPvInvitations(serverDetail.sub_id)
      setSuccessMessage(
        `Form Pradita Value berhasil dikirim ke ${selectedEvaluator.name}.`
      )
      setSelectedEvaluator(null)
      loadDetail()
    } catch (err) {
      setErrorMessage(
        err?.message || 'Gagal mengirim form Pradita Value.'
      )
      setSelectedEvaluator(null)
    }
  }

  const kaprodiOptions = dosenList.filter((d) => Number(d.is_kaprodi) === 1)
  const dosen2Options = dosenList.filter(
    (d) => String(d.user_id) !== String(selectedKaprodiId)
  )

  return (
    <AdminShell>
      {/* BACK */}
      <div className="verif-top-bar">
        <button
          type="button"
          className="verif-back-btn"
          onClick={() => navigate('/admin/pradita-value')}
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Pradita Value</span>
        </button>
      </div>

      {/* PAGE HEADER */}
      <div className="finexy-page-header">
        <div>
          <h1>Detail Asesmen Pradita Value</h1>
          <p>
            Kelola penilai rekan sejawat, tetapkan dosen penilai, dan kirim kuesioner Pradita Value.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="finexy-alert-banner success">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')}>
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="finexy-alert-banner error">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage('')}>
            ✕
          </button>
        </div>
      )}

      {/* KARTU IDENTITAS FINALIS */}
      <section className="pv-detail-banner">
        <div className="pv-detail-left">
          <div className="pv-detail-avatar">{finalist.initials}</div>
          <div>
            <h2>{finalist.name}</h2>
            <div className="pv-detail-meta">
              <strong>NIM {finalist.nim}</strong>
              <span>•</span>
              <span>Program Studi {finalist.prodi}</span>
              <span>•</span>
              <span>Angkatan {finalist.angkatan}</span>
            </div>
          </div>
        </div>

        <div className="pv-detail-right">
          <div className="pv-detail-score-box">
            <span>Skor Tahap 1</span>
            <strong>{finalist.tahap1}</strong>
          </div>

          <span
            className={`finexy-status-pill ${
              finalist.statusType === 'completed'
                ? 'approved'
                : finalist.statusType === 'waiting'
                  ? 'revision'
                  : 'review'
            }`}
          >
            {finalist.status}
          </span>
        </div>
      </section>

      {/* 4 STAT CARDS */}
      <section className="finexy-stats-row">
        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Total Penilai</span>
            <div className="finexy-stat-icon">
              <Users size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>5</strong>
            <span className="finexy-stat-badge rose">Evaluator</span>
          </div>
          <p className="finexy-stat-foot">3 rekan sejawat + 2 dosen</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Form Terkirim</span>
            <div className="finexy-stat-icon">
              <Send size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{sentCount}/5</strong>
            <span className="finexy-stat-badge neutral">Undangan</span>
          </div>
          <p className="finexy-stat-foot">Email asesmen terkirim</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Respon Masuk</span>
            <div className="finexy-stat-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{responseCount}/5</strong>
            <span className="finexy-stat-badge green">Selesai</span>
          </div>
          <p className="finexy-stat-foot">Penilai telah mengisi form</p>
        </div>

        <div className="finexy-stat-card">
          <div className="finexy-stat-top">
            <span>Sisa Penilaian</span>
            <div className="finexy-stat-icon">
              <Clock size={18} />
            </div>
          </div>
          <div className="finexy-stat-middle">
            <strong>{Math.max(0, 5 - responseCount)}</strong>
            <span className="finexy-stat-badge amber">Menunggu</span>
          </div>
          <p className="finexy-stat-foot">Belum memberikan respon</p>
        </div>
      </section>

      {/* REKAN SEJAWAT */}
      <section className="finexy-panel pv-eval-card">
        <div className="pv-eval-head">
          <div className="pv-eval-title">
            <div className="pv-eval-icon">
              <Users size={17} />
            </div>
            <div>
              <h3>Rekan Sejawat</h3>
              <p>Tiga rekan sejawat yang diajukan langsung oleh mahasiswa finalis.</p>
            </div>
          </div>

          <span className="pv-eval-badge">
            {peers.filter((item) => item.email !== '-').length}/3 Data
          </span>
        </div>

        <div className="pv-eval-list">
          {peers.map((evaluator, index) => (
            <EvaluatorRow
              key={evaluator.id}
              evaluator={evaluator}
              number={index + 1}
              onAction={() => setSelectedEvaluator(evaluator)}
              disabled={evaluator.email === '-'}
            />
          ))}
        </div>
      </section>

      {/* DOSEN PENILAI */}
      <section className="finexy-panel pv-eval-card">
        <div className="pv-eval-head">
          <div className="pv-eval-title">
            <div className="pv-eval-icon">
              <GraduationCap size={17} />
            </div>
            <div>
              <h3>Dosen Penilai</h3>
              <p>
                Terdiri dari Kaprodi Sistem Informasi dan 1 Dosen Penilai pendamping.
              </p>
            </div>
          </div>

          <span className="pv-eval-badge">
            {lecturers.filter((item) => item.email !== '-').length}/2 Dosen
          </span>
        </div>

        {sentCount === 0 && dosenList.length > 0 && (
          <div className="pv-lecturer-picker">
            <div className="pv-picker-field">
              <label>Dosen Penilai 1 (Kaprodi)</label>
              <select
                value={selectedKaprodiId}
                onChange={(e) => setSelectedKaprodiId(e.target.value)}
              >
                <option value="">-- Pilih Kaprodi --</option>
                {(kaprodiOptions.length > 0 ? kaprodiOptions : dosenList).map(
                  (d) => (
                    <option key={d.user_id} value={d.user_id}>
                      {d.name} ({d.email})
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="pv-picker-field">
              <label>Dosen Penilai 2</label>
              <select
                value={selectedDosen2Id}
                onChange={(e) => setSelectedDosen2Id(e.target.value)}
              >
                <option value="">-- Pilih Dosen Penilai 2 --</option>
                {dosen2Options.map((d) => (
                  <option key={d.user_id} value={d.user_id}>
                    {d.name} ({d.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="finexy-stage-btn primary pv-save-lec-btn"
              onClick={handleSaveLecturers}
              disabled={savingDosen}
            >
              <UserCheck size={15} />
              <span>
                {savingDosen ? 'Menyimpan...' : 'Simpan Dosen Penilai'}
              </span>
            </button>
          </div>
        )}

        <div className="pv-eval-list">
          {lecturers.map((evaluator, index) => (
            <EvaluatorRow
              key={evaluator.id}
              evaluator={evaluator}
              number={index + 1}
              onAction={() => setSelectedEvaluator(evaluator)}
              disabled={evaluator.email === '-'}
            />
          ))}
        </div>
      </section>

      {/* DISTRIBUSI FORM & TOKEN INFO */}
      <section className="finexy-panel pv-distribute-bar">
        <div className="pv-distribute-info">
          <div className="pv-info-icon">
            <Info size={16} />
          </div>
          <div>
            <h3>Distribusi Kuesioner Pradita Value</h3>
            <p>
              Setiap penilai akan menerima email berisi tautan kuesioner dan token unik satu kali pakai. Pastikan 3 rekan sejawat dan 2 dosen sudah lengkap sebelum mengirim.
            </p>
          </div>
        </div>

        <div className="pv-distribute-actions">
          {!peersComplete || !lecturersComplete ? (
            <button
              type="button"
              className="finexy-row-btn"
              disabled
            >
              <span>Lengkapi 5 Penilai Terlebih Dahulu</span>
            </button>
          ) : canSendAll ? (
            <button
              type="button"
              className="finexy-stage-btn primary"
              onClick={() => setShowSendAllModal(true)}
            >
              <Mail size={15} />
              <span>Kirim Form ke Seluruh Penilai</span>
            </button>
          ) : (
            <div className="verif-verified-badge">
              <CheckCircle2 size={16} />
              <span>Seluruh Form Telah Dikirim</span>
            </div>
          )}
        </div>
      </section>

      {/* MODAL KIRIM SATU PENILAI */}
      {selectedEvaluator && !selectedEvaluator.sent && (
        <div
          className="action-modal-overlay"
          onClick={() => setSelectedEvaluator(null)}
        >
          <div
            className="action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-modal-icon approve">
              <Mail size={22} />
            </div>

            <h2>Kirim Form Penilaian?</h2>
            <p className="action-modal-description">
              Tautan kuesioner Pradita Value akan dikirimkan ke email penilai berikut:
            </p>

            <div className="pv-modal-recipient">
              <strong>{selectedEvaluator.name}</strong>
              <span>{selectedEvaluator.email}</span>
              <small>{selectedEvaluator.role}</small>
            </div>

            <div className="action-modal-buttons">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setSelectedEvaluator(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="modal-confirm approve"
                onClick={handleSendSingle}
              >
                Ya, Kirim Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KIRIM SEMUA */}
      {showSendAllModal && (
        <div
          className="action-modal-overlay"
          onClick={() => setShowSendAllModal(false)}
        >
          <div
            className="action-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-modal-icon approve">
              <Send size={22} />
            </div>

            <h2>Kirim Form ke 5 Penilai?</h2>
            <p className="action-modal-description">
              Sistem akan mengirimkan email undangan kuesioner Pradita Value beserta token unik satu kali pakai kepada 3 Rekan Sejawat dan 2 Dosen Penilai untuk <strong>{finalist.name}</strong>.
            </p>

            <div className="action-modal-buttons">
              <button
                type="button"
                className="modal-cancel"
                onClick={() => setShowSendAllModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="modal-confirm approve"
                onClick={handleSendAll}
              >
                Ya, Kirim Semua Form
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

function EvaluatorRow({ evaluator, number, onAction, disabled = false }) {
  const actionDisabled = disabled || evaluator.sent || evaluator.responded

  return (
    <div className="pv-eval-row">
      <div className="pv-eval-num">{number}</div>

      <div className="pv-eval-identity">
        <strong>{evaluator.name}</strong>
        <span>{evaluator.email}</span>
        <small>{evaluator.role}</small>
      </div>

      <div className="pv-eval-col">
        <span>Token</span>
        <strong>{evaluator.token}</strong>
      </div>

      <div className="pv-eval-col">
        <span>Status Form</span>
        <strong className={evaluator.sent ? 'text-green' : 'text-muted'}>
          {evaluator.sent ? 'Terkirim' : 'Belum Dikirim'}
        </strong>
      </div>

      <div className="pv-eval-col">
        <span>Respon</span>
        <strong
          className={
            evaluator.responded
              ? 'text-green'
              : evaluator.sent
                ? 'text-amber'
                : 'text-muted'
          }
        >
          {evaluator.responded
            ? 'Sudah Mengisi'
            : evaluator.sent
              ? 'Menunggu Respon'
              : '-'}
        </strong>
      </div>

      <div className="pv-eval-action">
        <button
          type="button"
          className={`finexy-row-btn ${!actionDisabled ? 'primary' : ''}`}
          disabled={actionDisabled}
          onClick={onAction}
        >
          <span>
            {evaluator.responded
              ? 'Selesai'
              : evaluator.sent
                ? 'Terkirim'
                : disabled
                  ? 'Belum Lengkap'
                  : 'Kirim Form'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default DetailPraditaValue
