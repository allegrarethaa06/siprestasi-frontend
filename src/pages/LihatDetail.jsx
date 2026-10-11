import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import DocumentModal from '../components/DocumentModal'

import './VerifikasiPengajuan.css'

function LihatDetail() {
  const navigate = useNavigate()

  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleViewDocument = (fileName, fileSize) => {
    setSelectedDocument({
      fileName,
      fileSize,
    })
  }

  return (
    <div className="verification-page">

      <Navbar variant="light" />

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
            Detail Pengajuan
          </h1>

          <p>
            Lihat data, dokumen, dan hasil verifikasi pengajuan
            mahasiswa.
          </p>

        </section>

        {/* IDENTITAS */}
        <section className="student-summary-card">

          <div className="student-summary-left">

            <div className="verification-avatar">
              SN
            </div>

            <div>

              <h2>
                Siti Nurhaliza
              </h2>

              <div className="student-summary-meta">

                <strong>
                  NIM 13521012
                </strong>

                <span>•</span>

                <span>
                  Program Studi: S1 Sistem Informasi
                </span>

                <span>•</span>

                <span>
                  Angkatan: 2024
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
              background: '#E8F8F1',
              color: '#168A68',
              border: '1px solid #BFE7D8',
            }}
          >
            ✓ Disetujui
          </span>

        </section>

        {/* DATA MAHASISWA */}
        <DetailSection
          title="♙ Data Mahasiswa"
          rightLabel="TERINTEGRASI PDDIKTI / SIA"
        >

          <div className="verification-grid three-columns">

            <InfoBox
              label="Nama Lengkap"
              value="Siti Nurhaliza"
            />

            <InfoBox
              label="Nomor Induk Mahasiswa (NIM)"
              value="13521012"
            />

            <InfoBox
              label="Tahun Angkatan"
              value="2024"
            />

            <InfoBox
              label="Program Studi"
              value="S1 Sistem Informasi"
            />

            <InfoBox
              label="Indeks Prestasi Kumulatif (IPK)"
              value={
                <>
                  <span className="highlight-value">
                    3.91
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

        </DetailSection>

        {/* PRESTASI */}
        <DetailSection
          title="♕ Prestasi Terbaik"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Prestasi"
              value="Juara 2 National Business Case Competition"
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
            fileName="Sertifikat_Prestasi_Siti.pdf"
            fileSize="1.5 MB"
            onView={handleViewDocument}
          />

        </DetailSection>

        {/* ORGANISASI */}
        <DetailSection
          title="♣ Organisasi"
        >

          <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Organisasi"
              value="Himpunan Mahasiswa Sistem Informasi"
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
            fileName="Bukti_Organisasi_Siti.pdf"
            fileSize="1.1 MB"
            onView={handleViewDocument}
          />

        </DetailSection>

        {/* BAHASA ASING */}
        <DetailSection
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
                  575
                </span>
              }
            />

            <InfoBox
              label="Tanggal Tes"
              value="15 Januari 2026"
            />

            <InfoBox
              label="Lembaga Penerbit"
              value="Language Center Universitas"
            />

            <InfoBox
              label="Masa Berlaku Hingga"
              value="15 Januari 2028"
            />

          </div>

          <DocumentRow
            fileName="Sertifikat_TOEFL_Siti.pdf"
            fileSize="920 KB"
            onView={handleViewDocument}
          />

        </DetailSection>

        {/* RINGKASAN */}
        <DetailSection
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
                91.25
              </strong>

              <small>
                Dihitung otomatis berdasarkan data pengajuan.
              </small>

            </div>

          </div>

        </DetailSection>

        {/* HASIL VERIFIKASI */}
        <section className="verification-decision">

          <div>

            <h3>
              Hasil Verifikasi
            </h3>

            <p>
              Pengajuan mahasiswa telah selesai diverifikasi.
            </p>

          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >

            <span
              style={{
                padding: '9px 14px',
                borderRadius: '6px',
                background: '#E8F8F1',
                color: '#168A68',
                fontSize: '10px',
                fontWeight: '600',
              }}
            >
              ✓ Disetujui
            </span>

            <span
              style={{
                fontSize: '10px',
                color: '#877C80',
              }}
            >
              Diverifikasi 19 Februari 2026
            </span>

          </div>

        </section>

      </main>

      <footer className="verification-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa
        Berprestasi Universitas.
      </footer>

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

function DetailSection({
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

export default LihatDetail