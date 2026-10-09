import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ActionModal from '../components/ActionModal'
import DocumentModal from '../components/DocumentModal'

import './VerifikasiPengajuan.css'

function TinjauRevisi() {
  const navigate = useNavigate()

  const [modalType, setModalType] = useState(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [resultMessage, setResultMessage] = useState('')

  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleConfirmAction = () => {
    if (modalType === 'approve') {
      setResultMessage(
        'Revisi berhasil disetujui dan pengajuan dinyatakan lolos verifikasi Tahap 1.'
      )
    }

    if (modalType === 'revision-again') {
      setResultMessage(
        'Permintaan revisi lanjutan berhasil dikirim kepada mahasiswa.'
      )
    }

    setModalType(null)
    setRevisionNote('')
  }

  const handleViewDocument = (fileName, fileSize) => {
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
            Tinjau Revisi Pengajuan
          </h1>

          <p>
            Periksa kembali data dan dokumen yang telah diperbaiki
            oleh mahasiswa.
          </p>

        </section>

        {/* IDENTITAS */}
        <section className="student-summary-card">

          <div className="student-summary-left">

            <div className="verification-avatar">
              KJ
            </div>

            <div>

              <h2>
                Kevin Jonathan
              </h2>

              <div className="student-summary-meta">

                <strong>
                  NIM 13522005
                </strong>

                <span>•</span>

                <span>
                  Program Studi: S1 Desain Komunikasi Visual
                </span>

                <span>•</span>

                <span>
                  Angkatan: 2026
                </span>

                <span>•</span>

                <span>
                  Periode Seleksi: 2026
                </span>

              </div>

            </div>

          </div>

          <span
            className="verification-status"
            style={{
              background: '#FFF4EA',
              color: '#B46000',
              border: '1px solid #F1C894',
            }}
          >
            ↻ Revisi Dikirim Ulang
          </span>

        </section>

        {/* CATATAN REVISI */}
        <section className="verification-section revision-note-section">

          <div className="verification-section-header">

            <h3>
              ✎ Catatan Revisi Sebelumnya
            </h3>

            <span>
              DIKIRIM ADMIN
            </span>

          </div>

          <div className="revision-note-box">

            <div className="revision-note-copy">

              <span className="revision-note-label">
                Catatan untuk mahasiswa
              </span>

              <p>
                Mohon unggah kembali bukti organisasi dengan dokumen
                yang lebih jelas dan pastikan nama organisasi serta
                jabatan dapat terbaca.
              </p>

            </div>

            <div className="revision-note-meta">

              <span>
                Dikirim: 17 Februari 2026
              </span>

              <strong>
                ✓ Revisi telah dikirim ulang
              </strong>

            </div>

          </div>

        </section>

        {/* DATA MAHASISWA */}
        <RevisionSection
          title="♙ Data Mahasiswa"
          rightLabel="TERINTEGRASI PDDIKTI / SIA"
        >

          <div className="verification-grid three-columns">

            <InfoBox
              label="Nama Lengkap"
              value="Kevin Jonathan"
            />

            <InfoBox
              label="Nomor Induk Mahasiswa (NIM)"
              value="13522005"
            />

            <InfoBox
              label="Tahun Angkatan"
              value="2026"
            />

            <InfoBox
              label="Program Studi"
              value="S1 Desain Komunikasi Visual"
            />

            <InfoBox
              label="Indeks Prestasi Kumulatif (IPK)"
              value={
                <>
                  <span className="highlight-value">
                    3.78
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

        </RevisionSection>

        {/* PRESTASI */}
        <RevisionSection
          title="♕ Prestasi Terbaik"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Prestasi"
              value="Finalis National Poster Design Competition"
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
            fileName="Sertifikat_Prestasi_Kevin.pdf"
            fileSize="1.4 MB"
            onView={handleViewDocument}
          />

        </RevisionSection>

        {/* ORGANISASI */}
        <RevisionSection
          title="♣ Organisasi"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Organisasi"
              value="Himpunan Mahasiswa DKV"
            />

            <InfoBox
              label="Tingkat Organisasi"
              value="Lokal / Universitas"
            />

            <InfoBox
              label="Jabatan / Peran"
              value="Koordinator Divisi"
            />

            <InfoBox
              label="Periode Keaktifan"
              value="2025–2026"
            />

          </div>

          <div className="revision-document-label">
            Dokumen hasil revisi
          </div>

          <DocumentRow
            fileName="Bukti_Organisasi_Kevin_REVISI.pdf"
            fileSize="1.6 MB"
            onView={handleViewDocument}
          />

        </RevisionSection>

        {/* BAHASA ASING */}
        <RevisionSection
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
                  545
                </span>
              }
            />

            <InfoBox
              label="Tanggal Tes"
              value="22 Januari 2026"
            />

            <InfoBox
              label="Lembaga Penerbit"
              value="Language Center Universitas"
            />

            <InfoBox
              label="Masa Berlaku Hingga"
              value="22 Januari 2028"
            />

          </div>

          <DocumentRow
            fileName="Sertifikat_TOEFL_Kevin.pdf"
            fileSize="900 KB"
            onView={handleViewDocument}
          />

        </RevisionSection>

        {/* RINGKASAN */}
        <RevisionSection
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
                84.75
              </strong>

              <small>
                Dihitung otomatis berdasarkan data pengajuan.
              </small>

            </div>

          </div>

        </RevisionSection>

        {/* SUCCESS */}
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
              Keputusan Tinjau Revisi
            </h3>

            <p>
              Tentukan hasil setelah memeriksa dokumen revisi
              mahasiswa.
            </p>

          </div>

          <div className="decision-actions">

            <button
              type="button"
              className="decision-button revise"
              onClick={() => {
                setResultMessage('')
                setModalType('revision-again')
              }}
            >
              ✎ Minta Revisi Lagi
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
        studentName="Kevin Jonathan"
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

function RevisionSection({
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
   DOCUMENT
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

export default TinjauRevisi