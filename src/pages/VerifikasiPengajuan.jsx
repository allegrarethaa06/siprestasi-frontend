import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ActionModal from '../components/ActionModal'
import DocumentModal from '../components/DocumentModal'

import './VerifikasiPengajuan.css'

function VerifikasiPengajuan() {
  const navigate = useNavigate()

  const [modalType, setModalType] = useState(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [resultMessage, setResultMessage] = useState('')

  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleConfirmAction = () => {
    if (modalType === 'approve') {
      setResultMessage(
        'Pengajuan berhasil disetujui.'
      )
    }

    if (modalType === 'revision') {
      setResultMessage(
        'Permintaan revisi berhasil dikirim kepada mahasiswa.'
      )
    }

    setModalType(null)
    setRevisionNote('')
  }

  const handleViewDocument = (
    fileName,
    fileSize
  ) => {
    setSelectedDocument({
      fileName,
      fileSize,
    })
  }

  return (
    <div className="verification-page">

      <Navbar />

      <main className="verification-content">

        {/* BACK */}
        <button
          type="button"
          className="verification-back"
          onClick={() =>
            navigate('/admin/daftar-mapres')
          }
        >
          ←
          <span>
            Kembali ke Daftar Mapres
          </span>
        </button>

        {/* HEADING */}
        <section className="verification-heading">

          <h1>
            Verifikasi Pengajuan
          </h1>

          <p>
            Periksa data dan dokumen pengajuan mahasiswa
            sebelum menentukan hasil verifikasi.
          </p>

        </section>

        {/* IDENTITAS */}
        <section className="student-summary-card">

          <div className="student-summary-left">

            <div className="verification-avatar">
              AR
            </div>

            <div>

              <h2>
                Ahmad Rizky Pratama
              </h2>

              <div className="student-summary-meta">

                <strong>
                  NIM 13521048
                </strong>

                <span>•</span>

                <span>
                  Program Studi: S1 Informatika
                </span>

                <span>•</span>

                <span>
                  Angkatan: 2025
                </span>

                <span>•</span>

                <span>
                  Periode Seleksi: 2026
                </span>

              </div>

            </div>

          </div>

          <span className="verification-status review">
            ● Perlu Ditinjau
          </span>

        </section>

        {/* DATA MAHASISWA */}
        <VerificationSection
          title="♙ Data Mahasiswa"
          rightLabel="TERINTEGRASI PDDIKTI / SIA"
        >

          <div className="verification-grid three-columns">

            <InfoBox
              label="Nama Lengkap"
              value="Ahmad Rizky Pratama"
            />

            <InfoBox
              label="Nomor Induk Mahasiswa (NIM)"
              value="13521048"
            />

            <InfoBox
              label="Tahun Angkatan"
              value="2025"
            />

            <InfoBox
              label="Program Studi"
              value="S1 Informatika"
            />

            <InfoBox
              label="Indeks Prestasi Kumulatif (IPK)"
              value={
                <>
                  <span className="highlight-value">
                    3.82
                  </span>

                  <span className="muted-value">
                    {' '} / 4.00
                  </span>
                </>
              }
              tag="Data otomatis"
            />

            <InfoBox
              label="Status SKPI"
              value={
                <span className="available-value">
                  ✓ Tersedia
                </span>
              }
              tag="Data otomatis"
            />

          </div>

        </VerificationSection>

        {/* PRESTASI */}
        <VerificationSection
          title="♕ Prestasi Terbaik"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Prestasi"
              value="Juara 1 UI/UX Design Competition"
            />

            <InfoBox
              label="Tingkat Prestasi"
              value="Nasional"
            />

            <InfoBox
              label="Tahun Perolehan"
              value="2025"
            />

            <InfoBox
              label="Instansi Penyelenggara"
              value="Universitas Contoh Indonesia"
            />

          </div>

          <DocumentRow
            fileName="Sertifikat_Prestasi_Ahmad.pdf"
            fileSize="1.8 MB"
            onView={handleViewDocument}
          />

        </VerificationSection>

        {/* ORGANISASI */}
        <VerificationSection
          title="♣ Organisasi"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Organisasi"
              value="Himpunan Mahasiswa Informatika"
            />

            <InfoBox
              label="Tingkat Organisasi"
              value="Lokal / Universitas"
            />

            <InfoBox
              label="Jabatan / Peran"
              value="Ketua"
            />

            <InfoBox
              label="Periode Keaktifan"
              value="2024–2025"
            />

          </div>

          <DocumentRow
            fileName="Bukti_Organisasi_Ahmad.pdf"
            fileSize="1.2 MB"
            onView={handleViewDocument}
          />

        </VerificationSection>

        {/* BAHASA ASING */}
        <VerificationSection
          title="文 Bahasa Asing"
        >

          <div className="verification-grid three-columns">

            <InfoBox
              label="Bahasa"
              value="Bahasa Inggris"
            />

            <InfoBox
              label="Jenis Sertifikat"
              value="TOEFL ITP"
            />

            <InfoBox
              label="Skor / Level"
              value={
                <span className="highlight-value">
                  560
                </span>
              }
            />

            <InfoBox
              label="Tanggal Tes"
              value="10 Januari 2026"
            />

            <InfoBox
              label="Lembaga Penerbit"
              value="Language Center Universitas"
            />

            <InfoBox
              label="Masa Berlaku Hingga"
              value="10 Januari 2028"
            />

          </div>

          <DocumentRow
            fileName="Sertifikat_TOEFL_Ahmad.pdf"
            fileSize="950 KB"
            onView={handleViewDocument}
          />

        </VerificationSection>

        {/* RINGKASAN */}
        <VerificationSection
          title="☑ Ringkasan Verifikasi"
        >

          <div className="verification-summary">

            <div className="verification-checks">

              <VerificationCheck
                label="Data Mahasiswa"
              />

              <VerificationCheck
                label="Prestasi Terbaik"
              />

              <VerificationCheck
                label="Organisasi"
              />

              <VerificationCheck
                label="Bahasa Asing"
              />

            </div>

            <div className="score-summary">

              <span>
                Nilai Tahap 1:
              </span>

              <strong>
                87.50
              </strong>

              <small>
                Dihitung otomatis berdasarkan data pengajuan.
              </small>

            </div>

          </div>

        </VerificationSection>

        {/* SUCCESS MESSAGE */}
        {resultMessage && (
          <div className="verification-success-message">

            <span>
              ✓
            </span>

            {resultMessage}

          </div>
        )}

        {/* KEPUTUSAN */}
        <section className="verification-decision">

          <div>

            <h3>
              Keputusan Verifikasi
            </h3>

            <p>
              Tentukan hasil verifikasi pengajuan mahasiswa.
            </p>

          </div>

          <div className="decision-actions">

            <button
              type="button"
              className="decision-button revise"
              onClick={() => {
                setResultMessage('')
                setModalType('revision')
              }}
            >
              ✎ Minta Revisi
            </button>

            <button
              type="button"
              className="decision-button approve"
              onClick={() => {
                setResultMessage('')
                setModalType('approve')
              }}
            >
              ✓ Setujui Pengajuan
            </button>

          </div>

        </section>

      </main>

      <footer className="verification-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa
        Berprestasi Universitas.
      </footer>

      {/* ACTION MODAL */}
      <ActionModal
        open={modalType !== null}
        type={modalType}
        studentName="Ahmad Rizky Pratama"
        revisionNote={revisionNote}
        setRevisionNote={setRevisionNote}
        onClose={() => {
          setModalType(null)
          setRevisionNote('')
        }}
        onConfirm={handleConfirmAction}
      />

      {/* DOCUMENT MODAL */}
      <DocumentModal
        open={selectedDocument !== null}
        fileName={
          selectedDocument?.fileName || ''
        }
        fileSize={
          selectedDocument?.fileSize || ''
        }
        onClose={() =>
          setSelectedDocument(null)
        }
      />

    </div>
  )
}

/* =========================
   SECTION
========================= */

function VerificationSection({
  title,
  rightLabel,
  children,
}) {
  return (
    <section className="verification-section">

      <div className="verification-section-header">

        <h3>
          {title}
        </h3>

        {rightLabel && (
          <span>
            {rightLabel}
          </span>
        )}

      </div>

      {children}

    </section>
  )
}

/* =========================
   INFO BOX
========================= */

function InfoBox({
  label,
  value,
  tag,
}) {
  return (
    <div className="verification-info-box">

      <span className="verification-info-label">
        {label}
      </span>

      <div className="verification-info-value-row">

        <strong>
          {value}
        </strong>

        {tag && (
          <span className="auto-data-tag">
            {tag}
          </span>
        )}

      </div>

    </div>
  )
}

/* =========================
   DOCUMENT ROW
========================= */

function DocumentRow({
  fileName,
  fileSize,
  onView,
}) {
  return (
    <div className="document-row">

      <div className="document-left">

        <div className="document-icon">
          ▣
        </div>

        <div>

          <strong>
            {fileName}
          </strong>

          <div className="document-meta">

            <span>
              {fileSize}
            </span>

            <span>
              •
            </span>

            <span className="document-available">
              ● Dokumen Tersedia
            </span>

          </div>

        </div>

      </div>

      <button
        type="button"
        className="view-document-button"
        onClick={() =>
          onView(fileName, fileSize)
        }
      >
        ◉ Lihat Dokumen
      </button>

    </div>
  )
}

/* =========================
   CHECK
========================= */

function VerificationCheck({
  label,
}) {
  return (
    <div className="verification-check">

      <span>
        ✓
      </span>

      <p>
        {label}:{' '}

        <strong>
          Terverifikasi
        </strong>
      </p>

    </div>
  )
}

export default VerifikasiPengajuan