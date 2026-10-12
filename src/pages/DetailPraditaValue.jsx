import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Navbar from '../components/Navbar'

import './DetailPraditaValue.css'

const finalists = {
  13521012: {
    initials: 'SN',
    name: 'Siti Nurhaliza',
    nim: '13521012',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2024',
    tahap1: '91.25',
    status: 'Selesai',
    statusType: 'completed',
    responseCount: 5,
  },

  13520011: {
    initials: 'RF',
    name: 'Reza Firmansyah',
    nim: '13520011',
    prodi: 'S1 Teknik Industri',
    angkatan: '2024',
    tahap1: '88.50',
    status: 'Penilaian Berlangsung',
    statusType: 'progress',
    responseCount: 3,
  },

  13520037: {
    initials: 'DA',
    name: 'Dinda Amelia',
    nim: '13520037',
    prodi: 'S1 Manajemen Bisnis',
    angkatan: '2024',
    tahap1: '86.75',
    status: 'Siap Dikirim',
    statusType: 'ready',
    responseCount: 0,
  },

  13521089: {
    initials: 'AP',
    name: 'Amanda Putri',
    nim: '13521089',
    prodi: 'S1 Informatika',
    angkatan: '2025',
    tahap1: '90.75',
    status: 'Selesai',
    statusType: 'completed',
    responseCount: 5,
  },

  13521048: {
    initials: 'AR',
    name: 'Ahmad Rizky Pratama',
    nim: '13521048',
    prodi: 'S1 Informatika',
    angkatan: '2025',
    tahap1: '87.50',
    status: 'Penilaian Berlangsung',
    statusType: 'progress',
    responseCount: 2,
  },

  13521066: {
    initials: 'BA',
    name: 'Bagas Aditya Rahman',
    nim: '13521066',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2025',
    tahap1: '85.85',
    status: 'Menunggu Data Rekan Sejawat',
    statusType: 'waiting',
    responseCount: 0,
  },

  13522005: {
    initials: 'KJ',
    name: 'Kevin Jonathan',
    nim: '13522005',
    prodi: 'S1 Desain Komunikasi Visual',
    angkatan: '2026',
    tahap1: '84.75',
    status: 'Penilaian Berlangsung',
    statusType: 'progress',
    responseCount: 4,
  },

  13522033: {
    initials: 'MF',
    name: 'Muhammad Farhan',
    nim: '13522033',
    prodi: 'S1 Teknik Industri',
    angkatan: '2026',
    tahap1: '83.90',
    status: 'Siap Dikirim',
    statusType: 'ready',
    responseCount: 0,
  },

  13522047: {
    initials: 'NF',
    name: 'Nadia Fitri',
    nim: '13522047',
    prodi: 'S1 Sistem Informasi',
    angkatan: '2026',
    tahap1: '82.75',
    status: 'Menunggu Data Rekan Sejawat',
    statusType: 'waiting',
    responseCount: 0,
  },
}

function createEvaluators(finalist) {
  const waiting = finalist.statusType === 'waiting'
  const ready = finalist.statusType === 'ready'

  const sent = !waiting && !ready
  const responses = finalist.responseCount

  const peerNames = [
    {
      name: 'Rania Putri',
      email: 'rania.putri@student.pradita.ac.id',
    },
    {
      name: 'Daniel Wijaya',
      email: 'daniel.wijaya@student.pradita.ac.id',
    },
    {
      name: 'Michelle Tan',
      email: 'michelle.tan@student.pradita.ac.id',
    },
  ]

  const peerEvaluators = peerNames.map(
    (peer, index) => {
      const responded =
        sent && index < Math.min(responses, 3)

      return {
        id: `peer-${index + 1}`,
        type: 'Rekan Sejawat',
        role: `Rekan Sejawat ${index + 1}`,
        name: waiting
          ? 'Belum dikirim mahasiswa'
          : peer.name,
        email: waiting ? '-' : peer.email,
        token: sent
          ? `PV-${finalist.angkatan}-P${index + 1}X8K`
          : '-',
        sent,
        responded,
      }
    }
  )

  const lecturerNames = [
    {
      role: 'Kaprodi',
      name: 'Dr. Afifah, S.Kom., M.Kom.',
      email: 'afifah@pradita.ac.id',
    },
    {
      role: 'Dosen Terpilih Sistem',
      name: 'Dr. Budi Santoso, S.T., M.T.',
      email: 'budi.santoso@pradita.ac.id',
    },
  ]

  const lecturerEvaluators = lecturerNames.map(
    (lecturer, index) => {
      const responseIndex = index + 3

      const responded =
        sent && responseIndex < responses

      return {
        id: `lecturer-${index + 1}`,
        type: 'Dosen',
        role: lecturer.role,
        name: lecturer.name,
        email: lecturer.email,
        token: sent
          ? `PV-${finalist.angkatan}-D${index + 1}Q4M`
          : '-',
        sent,
        responded,
      }
    }
  )

  return [
    ...peerEvaluators,
    ...lecturerEvaluators,
  ]
}

function DetailPraditaValue() {
  const navigate = useNavigate()
  const { nim } = useParams()

  const finalist =
    finalists[nim] || finalists['13522005']

  const initialEvaluators = useMemo(
    () => createEvaluators(finalist),
    [finalist]
  )

  const [evaluators, setEvaluators] =
    useState(initialEvaluators)

  const [selectedEvaluator, setSelectedEvaluator] =
    useState(null)

  const [showSendAllModal, setShowSendAllModal] =
    useState(false)

  const [successMessage, setSuccessMessage] =
    useState('')

  const peers = evaluators.filter(
    (item) => item.type === 'Rekan Sejawat'
  )

  const lecturers = evaluators.filter(
    (item) => item.type === 'Dosen'
  )

  const sentCount = evaluators.filter(
    (item) => item.sent
  ).length

  const responseCount = evaluators.filter(
    (item) => item.responded
  ).length

  const canSendAll =
    finalist.statusType !== 'waiting' &&
    sentCount < 5

  const handleSendAll = () => {
    setEvaluators((current) =>
      current.map((item, index) => {
        if (item.sent) {
          return item
        }

        return {
          ...item,
          sent: true,
          token: `PV-${finalist.angkatan}-${index + 1}A7K`,
        }
      })
    )

    setShowSendAllModal(false)

    setSuccessMessage(
      'Form Pradita Value berhasil dikirim ke seluruh penilai yang belum menerima form.'
    )
  }

  const handleSendSingle = () => {
    if (!selectedEvaluator) return

    if (selectedEvaluator.sent) {
      setSelectedEvaluator(null)
      return
    }

    setEvaluators((current) =>
      current.map((item, index) => {
        if (item.id !== selectedEvaluator.id) {
          return item
        }

        return {
          ...item,
          sent: true,
          token: `PV-${finalist.angkatan}-${index + 1}B9M`,
        }
      })
    )

    setSuccessMessage(
      `Form berhasil dikirim ke ${selectedEvaluator.name}.`
    )

    setSelectedEvaluator(null)
  }

  return (
    <div className="pradita-detail-page">

      <Navbar variant="light" />

      <main className="pradita-detail-content">

        {/* BACK */}

        <button
          type="button"
          className="pradita-detail-back"
          onClick={() =>
            navigate('/admin/pradita-value')
          }
        >
          ←

          <span>
            Kembali ke Pradita Value
          </span>
        </button>

        {/* HEADING */}

        <section className="pradita-detail-heading">

          <h1>
            Detail Asesmen Pradita Value
          </h1>

          <p>
            Kelola penilai, distribusi form, token,
            dan progres asesmen finalis.
          </p>

        </section>

        {/* FINALIST */}

        <section className="pradita-finalist-card">

          <div className="pradita-finalist-profile">

            <div className="pradita-finalist-avatar">
              {finalist.initials}
            </div>

            <div>

              <h2>
                {finalist.name}
              </h2>

              <div className="pradita-finalist-meta">

                <strong>
                  NIM {finalist.nim}
                </strong>

                <span>•</span>

                <span>
                  {finalist.prodi}
                </span>

                <span>•</span>

                <span>
                  Angkatan {finalist.angkatan}
                </span>

              </div>

            </div>

          </div>

          <div className="pradita-finalist-right">

            <div className="pradita-stage-score">

              <span>
                Nilai Tahap 1
              </span>

              <strong>
                {finalist.tahap1}
              </strong>

            </div>

            <span
              className={`pradita-detail-status ${finalist.statusType}`}
            >
              {finalist.status}
            </span>

          </div>

        </section>

        {/* SUMMARY */}

        <section className="pradita-detail-summary">

          <DetailSummary
            title="Total Penilai"
            value="5"
            description="3 rekan + 2 dosen"
          />

          <DetailSummary
            title="Form Terkirim"
            value={`${sentCount}/5`}
            description="Email asesmen terkirim"
          />

          <DetailSummary
            title="Respon Masuk"
            value={`${responseCount}/5`}
            description="Penilaian sudah dikirim"
          />

          <DetailSummary
            title="Sisa Penilaian"
            value={5 - responseCount}
            description="Belum memberikan respon"
          />

        </section>

        {/* SUCCESS */}

        {successMessage && (
          <div className="pradita-send-success">

            <span>
              ✓
            </span>

            {successMessage}

          </div>
        )}

        {/* REKAN SEJAWAT */}

        <EvaluatorSection
          title="Rekan Sejawat"
          subtitle="Tiga rekan sejawat diajukan oleh mahasiswa."
          badge={`${
            peers.filter(
              (item) =>
                item.name !==
                'Belum dikirim mahasiswa'
            ).length
          }/3 Data`}
        >

          {peers.map((evaluator, index) => (
            <EvaluatorRow
              key={evaluator.id}
              evaluator={evaluator}
              number={index + 1}
              onAction={() =>
                setSelectedEvaluator(evaluator)
              }
              disabled={
                evaluator.name ===
                'Belum dikirim mahasiswa'
              }
            />
          ))}

        </EvaluatorSection>

        {/* DOSEN */}

        <EvaluatorSection
          title="Dosen Penilai"
          subtitle="Kaprodi dan satu dosen dipilih otomatis oleh sistem."
          badge="2/2 Dosen"
        >

          {lecturers.map(
            (evaluator, index) => (
              <EvaluatorRow
                key={evaluator.id}
                evaluator={evaluator}
                number={index + 1}
                onAction={() =>
                  setSelectedEvaluator(evaluator)
                }
              />
            )
          )}

        </EvaluatorSection>

        {/* TOKEN INFO */}

        <section className="pradita-token-information">

          <div className="pradita-token-icon">
            i
          </div>

          <div>

            <strong>
              TOKEN PENILAIAN SATU KALI PAKAI
            </strong>

            <p>
              Setiap penilai menerima satu email
              berisi link form dan token unik.
              Form hanya dapat dikirim satu kali.
              Setelah token digunakan, token akan
              dinonaktifkan dan tidak dapat digunakan
              kembali.
            </p>

          </div>

        </section>

        {/* DISTRIBUTION */}

        <section className="pradita-distribution-card">

          <div>

            <h3>
              Distribusi Form Asesmen
            </h3>

            <p>
              Pastikan seluruh data penilai sudah
              lengkap sebelum mengirim form.
            </p>

          </div>

          {finalist.statusType === 'waiting' ? (
            <button
              type="button"
              className="pradita-send-all disabled"
              disabled
            >
              Menunggu Data Rekan Sejawat
            </button>
          ) : canSendAll ? (
            <button
              type="button"
              className="pradita-send-all"
              onClick={() =>
                setShowSendAllModal(true)
              }
            >
              ✉ Kirim Form ke Penilai
            </button>
          ) : (
            <div className="all-form-sent">
              ✓ Seluruh form telah dikirim
            </div>
          )}

        </section>

      </main>

      <footer className="pradita-detail-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa
        Berprestasi Universitas.
      </footer>

      {/* SINGLE SEND MODAL */}

      {selectedEvaluator &&
        !selectedEvaluator.sent && (
          <div className="pradita-modal-overlay">

            <div className="pradita-send-modal">

              <div className="pradita-modal-icon">
                ✉
              </div>

              <h2>
                Kirim Form Penilaian?
              </h2>

              <p>
                Form Pradita Value akan dikirim
                satu kali kepada:
              </p>

              <div className="pradita-recipient-box">

                <strong>
                  {selectedEvaluator.name}
                </strong>

                <span>
                  {selectedEvaluator.email}
                </span>

                <small>
                  {selectedEvaluator.role}
                </small>

              </div>

              <div className="pradita-modal-note">

                <span>
                  i
                </span>

                <p>
                  Sistem akan membuat satu token unik.
                  Setelah email dikirim, form tidak
                  dapat dikirim ulang kepada penilai ini.
                </p>

              </div>

              <div className="pradita-modal-actions">

                <button
                  type="button"
                  className="pradita-modal-cancel"
                  onClick={() =>
                    setSelectedEvaluator(null)
                  }
                >
                  Batal
                </button>

                <button
                  type="button"
                  className="pradita-modal-confirm"
                  onClick={handleSendSingle}
                >
                  ✉ Ya, Kirim Form
                </button>

              </div>

            </div>

          </div>
        )}

      {/* SEND ALL MODAL */}

      {showSendAllModal && (
        <div className="pradita-modal-overlay">

          <div className="pradita-send-modal">

            <div className="pradita-modal-icon">
              ✉
            </div>

            <h2>
              Kirim Form ke Penilai?
            </h2>

            <p>
              Sistem akan mengirim form hanya kepada
              penilai yang belum pernah menerima form.
            </p>

            <div className="pradita-modal-summary">

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
                  Dosen Penilai
                </span>

                <strong>
                  2 penilai
                </strong>
              </div>

              <div>
                <span>
                  Total Penilai
                </span>

                <strong>
                  5 orang
                </strong>
              </div>

            </div>

            <div className="pradita-modal-note">

              <span>
                i
              </span>

              <p>
                Setiap penilai hanya menerima satu
                kali pengiriman form dan satu token
                unik. Form yang sudah terkirim tidak
                dapat dikirim ulang.
              </p>

            </div>

            <div className="pradita-modal-actions">

              <button
                type="button"
                className="pradita-modal-cancel"
                onClick={() =>
                  setShowSendAllModal(false)
                }
              >
                Batal
              </button>

              <button
                type="button"
                className="pradita-modal-confirm"
                onClick={handleSendAll}
              >
                ✉ Ya, Kirim Form
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

function DetailSummary({
  title,
  value,
  description,
}) {
  return (
    <div className="pradita-detail-summary-card">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

      <p>
        {description}
      </p>

    </div>
  )
}

function EvaluatorSection({
  title,
  subtitle,
  badge,
  children,
}) {
  return (
    <section className="evaluator-section">

      <div className="evaluator-section-heading">

        <div>

          <h3>
            {title}
          </h3>

          <p>
            {subtitle}
          </p>

        </div>

        <span>
          {badge}
        </span>

      </div>

      <div className="evaluator-list">
        {children}
      </div>

    </section>
  )
}

function EvaluatorRow({
  evaluator,
  number,
  onAction,
  disabled = false,
}) {
  const actionDisabled =
    disabled ||
    evaluator.sent ||
    evaluator.responded

  return (
    <div className="evaluator-row">

      <div className="evaluator-number">
        {number}
      </div>

      <div className="evaluator-identity">

        <strong>
          {evaluator.name}
        </strong>

        <span>
          {evaluator.email}
        </span>

        <small>
          {evaluator.role}
        </small>

      </div>

      <div className="evaluator-token">

        <span>
          Token
        </span>

        <strong>
          {evaluator.token}
        </strong>

      </div>

      <div className="evaluator-delivery">

        <span>
          Status Form
        </span>

        <strong
          className={
            evaluator.sent
              ? 'sent'
              : 'not-sent'
          }
        >
          {evaluator.sent
            ? '✓ Terkirim'
            : 'Belum Dikirim'}
        </strong>

      </div>

      <div className="evaluator-response">

        <span>
          Respon
        </span>

        <strong
          className={
            evaluator.responded
              ? 'responded'
              : 'waiting'
          }
        >
          {evaluator.responded
            ? '✓ Sudah Mengisi'
            : evaluator.sent
              ? 'Menunggu Respon'
              : '-'}
        </strong>

      </div>

      <div className="evaluator-token-status">

        <span>
          Status Token
        </span>

        <strong
          className={
            evaluator.responded
              ? 'used'
              : evaluator.sent
                ? 'unused'
                : 'none'
          }
        >
          {evaluator.responded
            ? 'Sudah Digunakan'
            : evaluator.sent
              ? 'Belum Digunakan'
              : 'Belum Dibuat'}
        </strong>

      </div>

      <button
        type="button"
        className="evaluator-action"
        disabled={actionDisabled}
        onClick={onAction}
      >
        {evaluator.responded
          ? 'Selesai'
          : evaluator.sent
            ? 'Menunggu Respon'
            : disabled
              ? 'Belum Tersedia'
              : 'Kirim Form'}
      </button>

    </div>
  )
}

export default DetailPraditaValue