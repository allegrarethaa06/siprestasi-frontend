import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import SuperadminNavbar from '../../components/superadmin/SuperadminNavbar'
import DocumentModal from '../../components/superadmin/DocumentModal'
import { fetchSubmissionDetail } from '../../data/superadmin'

import './VerifikasiPengajuan.css'

function LihatDetail() {
  const navigate = useNavigate()
  const { nim } = useParams()

  const [selectedDocument, setSelectedDocument] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (!nim) return
    let cancelled = false
    fetchSubmissionDetail(nim)
      .then((res) => {
        if (!cancelled && res?.data) setDetail(res.data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [nim])

  const formData = detail?.form_data || {}
  const hasBahasa = formData?.hasBahasa === 'ya' || (detail?.documents?.bahasa && !!detail?.documents?.bahasa?.bah_file)
  const hasPrestasi = formData?.hasPrestasi === 'ya' || (detail?.documents?.prestasi && !!detail?.documents?.prestasi?.pres_file)
  const hasOrganisasi = formData?.hasOrganisasi === 'ya' || (detail?.documents?.organisasi && !!detail?.documents?.organisasi?.org_file)

  const student = {
    subId: detail?.sub_id,
    name: detail?.name || '',
    nim: detail?.nim || nim || '',
    prodi: detail?.prodi || 'S1 Informatika',
    angkatan: detail?.angkatan ? String(detail.angkatan) : '',
    periode: detail?.periode || '',
    initials: detail?.initials || (detail?.name ? detail.name.charAt(0) : ''),
    ipk: detail?.score?.ipk ? Number(detail.score.ipk).toFixed(2) : '0.00',
    prestasi: {
      hasSubmitted: hasPrestasi,
      nama:
        detail?.documents?.prestasi?.pres_name ||
        formData?.namaPrestasi ||
        detail?.form_data?.prestasi_nama ||
        '-',
      tingkat:
        detail?.documents?.prestasi?.pres_level ||
        formData?.tingkatPrestasi ||
        detail?.form_data?.prestasi_tingkat ||
        '-',
      tahun:
        detail?.documents?.prestasi?.pres_year ||
        formData?.tahunPrestasi ||
        detail?.form_data?.prestasi_tahun ||
        '-',
      instansi:
        detail?.documents?.prestasi?.pres_instansi ||
        formData?.penyelenggara ||
        detail?.form_data?.prestasi_instansi ||
        '-',
      fileName:
        detail?.documents?.prestasi?.pres_file || '',
      fileSize: detail?.documents?.prestasi?.pres_file ? 'Dokumen Terlampir' : '-',
      fileUrl: detail?.documents?.prestasi?.file_url,
    },
    organisasi: {
      hasSubmitted: hasOrganisasi,
      nama:
        detail?.documents?.organisasi?.org_name ||
        formData?.namaOrganisasi ||
        detail?.form_data?.organisasi_nama ||
        '-',
      tingkat:
        detail?.documents?.organisasi?.org_level ||
        formData?.tingkatOrganisasi ||
        detail?.form_data?.organisasi_tingkat ||
        '-',
      jabatan:
        detail?.documents?.organisasi?.org_position ||
        formData?.jabatan ||
        detail?.form_data?.organisasi_jabatan ||
        '-',
      periode:
        detail?.documents?.organisasi?.org_period ||
        formData?.periode ||
        detail?.form_data?.organisasi_periode ||
        '-',
      fileName:
        detail?.documents?.organisasi?.org_file || '',
      fileSize: detail?.documents?.organisasi?.org_file ? 'Dokumen Terlampir' : '-',
      fileUrl: detail?.documents?.organisasi?.file_url,
    },
    bahasa: {
      hasSubmitted: hasBahasa,
      bahasa:
        detail?.documents?.bahasa?.bah_name ||
        formData?.bahasa ||
        '-',
      jenis:
        detail?.documents?.bahasa?.bah_type ||
        formData?.tingkatSertifikat ||
        formData?.bahasa_jenis ||
        '-',
      skor:
        detail?.documents?.bahasa?.bah_score ||
        formData?.skor ||
        formData?.bahasa_skor ||
        '-',
      tanggalTes:
        formData?.tanggalTes ||
        '-',
      instansi:
        detail?.documents?.bahasa?.bah_instansi ||
        formData?.lembagaPenerbit ||
        formData?.bahasa_instansi ||
        '-',
      masaBerlaku:
        detail?.documents?.bahasa?.bah_valid_until ||
        formData?.tanggalKedaluwarsa ||
        formData?.bahasa_masa_berlaku ||
        '-',
      fileName:
        detail?.documents?.bahasa?.bah_file || '',
      fileSize: detail?.documents?.bahasa?.bah_file ? 'Dokumen Terlampir' : '-',
      fileUrl: detail?.documents?.bahasa?.file_url,
    },
    scoreTahap1: detail?.score?.total_score
      ? Number(detail.score.total_score).toFixed(2)
      : '0.00',
  }

  const handleViewDocument = (fileName, fileSize, fileUrl) => {
    setSelectedDocument({
      fileName,
      fileSize,
      fileUrl,
    })
  }

  return (
    <div className="verification-page">

      <SuperadminNavbar variant="light" />

      <main className="verification-content">

        {/* BACK */}
        <button
          type="button"
          className="verification-back"
          onClick={() =>
            navigate('/superadmin/daftar-mapres')
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
              {student.initials}
            </div>

            <div>

              <h2>
                {student.name}
              </h2>

              <div className="student-summary-meta">

                <strong>
                  NIM {student.nim}
                </strong>

                <span>•</span>

                <span>
                  Program Studi: {student.prodi}
                </span>

                <span>•</span>

                <span>
                  Angkatan: {student.angkatan}
                </span>

                <span>•</span>

                <span>
                  Periode Seleksi: {student.periode}
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
              value={student.name}
            />

            <InfoBox
              label="Nomor Induk Mahasiswa (NIM)"
              value={student.nim}
            />

            <InfoBox
              label="Tahun Angkatan"
              value={student.angkatan}
            />

            <InfoBox
              label="Program Studi"
              value={student.prodi}
            />

            <InfoBox
              label="Indeks Prestasi Kumulatif (IPK)"
              value={
                <>
                  <span className="highlight-value">
                    {student.ipk}
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
          {student.prestasi.hasSubmitted ? (
            <>
              <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Prestasi"
              value={student.prestasi.nama}
            />

            <InfoBox
              label="Tingkat Prestasi"
              value={student.prestasi.tingkat}
            />

            <InfoBox
              label="Tahun Perolehan"
              value={student.prestasi.tahun}
            />

            <InfoBox
              label="Instansi Penyelenggara"
              value={student.prestasi.instansi}
            />

          </div>

          {student.prestasi.fileName && (<DocumentRow
            fileName={student.prestasi.fileName}
            fileSize={student.prestasi.fileSize}
            fileUrl={student.subId ? `/api/admin/document/${student.subId}/prestasi` : ''}
            onView={handleViewDocument}
          />)}
            </>
          ) : (
            <div style={{ padding: '16px 20px', background: '#faf8f9', borderRadius: '10px', border: '1px solid #ede4e8' }}>
              <strong style={{ color: '#3d373a', fontSize: '13px' }}>Tidak ada prestasi yang diajukan.</strong>
              <p style={{ margin: '4px 0 0', color: '#888085', fontSize: '12px' }}>Mahasiswa memilih tidak mengajukan prestasi.</p>
            </div>
          )}
        </DetailSection>

        {/* ORGANISASI */}
        <DetailSection
          title="♣ Organisasi"
        >
          {student.organisasi.hasSubmitted ? (
            <>
              <div className="verification-grid four-columns">

            <InfoBox
              label="Nama Organisasi"
              value={student.organisasi.nama}
            />

            <InfoBox
              label="Tingkat Organisasi"
              value={student.organisasi.tingkat}
            />

            <InfoBox
              label="Jabatan / Peran"
              value={student.organisasi.jabatan}
            />

            <InfoBox
              label="Periode Keaktifan"
              value={student.organisasi.periode}
            />

          </div>

          {student.organisasi.fileName && (<DocumentRow
            fileName={student.organisasi.fileName}
            fileSize={student.organisasi.fileSize}
            fileUrl={student.subId ? `/api/admin/document/${student.subId}/organisasi` : ''}
            onView={handleViewDocument}
          />)}
            </>
          ) : (
            <div style={{ padding: '16px 20px', background: '#faf8f9', borderRadius: '10px', border: '1px solid #ede4e8' }}>
              <strong style={{ color: '#3d373a', fontSize: '13px' }}>Tidak ada keaktifan organisasi yang diajukan.</strong>
              <p style={{ margin: '4px 0 0', color: '#888085', fontSize: '12px' }}>Mahasiswa memilih tidak mengajukan data organisasi.</p>
            </div>
          )}
        </DetailSection>

        {/* BAHASA ASING */}
        <DetailSection
          title="文 Bahasa Asing"
        >
          {student.bahasa.hasSubmitted ? (
            <>

          <div className="verification-grid three-columns">

            <InfoBox
              label="Bahasa"
              value={student.bahasa.bahasa}
            />

            <InfoBox
              label="Jenis Sertifikat"
              value={student.bahasa.jenis}
            />

            <InfoBox
              label="Skor / Level"
              value={
                <span className="highlight-value">
                  {student.bahasa.skor}
                </span>
              }
            />

            <InfoBox
              label="Tanggal Tes"
              value={student.bahasa.tanggalTes}
            />

            <InfoBox
              label="Lembaga Penerbit"
              value={student.bahasa.instansi}
            />

            <InfoBox
              label="Masa Berlaku Hingga"
              value={student.bahasa.masaBerlaku}
            />

          </div>

          {student.bahasa.fileName && (<DocumentRow
            fileName={student.bahasa.fileName}
            fileSize={student.bahasa.fileSize}
            fileUrl={student.subId ? `/api/admin/document/${student.subId}/bahasa` : ''}
            onView={handleViewDocument}
          />)}

        </>
          ) : (
            <div style={{ padding: '16px 20px', background: '#faf8f9', borderRadius: '10px', border: '1px solid #ede4e8' }}>
              <strong style={{ color: '#3d373a', fontSize: '13px' }}>Tidak ada sertifikat bahasa asing yang diajukan.</strong>
              <p style={{ margin: '4px 0 0', color: '#888085', fontSize: '12px' }}>Mahasiswa memilih tidak mengajukan sertifikat bahasa asing.</p>
            </div>
          )}
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
                {student.scoreTahap1}
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
        fileUrl={
          selectedDocument?.fileUrl || ''
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
  fileUrl,
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
          onView(fileName, fileSize, fileUrl)
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
