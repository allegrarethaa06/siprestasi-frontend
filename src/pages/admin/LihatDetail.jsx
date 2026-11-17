import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Globe,
  RotateCcw,
  User,
  Users,
} from 'lucide-react'

import AdminShell from '../../components/admin/AdminShell'
import ActionModal from '../../components/admin/ActionModal'
import DocumentModal from '../../components/admin/DocumentModal'
import {
  fetchSubmissionDetail,
  updateSubmissionStatus,
} from '../../data/admin'
import {
  VerificationSection,
  InfoBox,
  DocumentRow,
  VerificationCheck,
} from './VerifikasiPengajuan'

import './VerifikasiPengajuan.css'

const formatLevel = (val) => {
  const map = {
    internasional: 'Internasional',
    nasional: 'Nasional',
    lokal: 'Lokal / Kampus',
    provinsi: 'Provinsi',
    'kabupaten-kota': 'Kabupaten / Kota',
    kampus: 'Kampus',
  }
  return map[val] || val || '-'
}

const formatRole = (val) => {
  const map = {
    ketua: 'Ketua',
    wakil: 'Wakil Ketua',
    'wakil-ketua': 'Wakil Ketua',
    sekretaris: 'Sekretaris',
    bendahara: 'Bendahara',
    koordinator: 'Koordinator Divisi',
    'koordinator-divisi': 'Koordinator Divisi',
    anggota_aktif: 'Anggota Aktif',
    anggota: 'Anggota Aktif',
  }
  return map[val] || val || '-'
}

const formatCertLevel = (val) => {
  const map = {
    tinggi: 'Tingkat Tinggi',
    menengah_atas: 'Tingkat Menengah Atas',
    menengah: 'Tingkat Menengah',
    dasar: 'Tingkat Dasar',
  }
  return map[val] || val || '-'
}

function LihatDetail() {
  const navigate = useNavigate()
  const { nim } = useParams()

  const [modalType, setModalType] = useState(null)
  const [revisionNote, setRevisionNote] = useState('')
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
  const hasBahasa =
    formData?.hasBahasa === 'ya' ||
    (detail?.documents?.bahasa && !!detail?.documents?.bahasa?.bah_file)
  const hasPrestasi =
    formData?.hasPrestasi === 'ya' ||
    (detail?.documents?.prestasi && !!detail?.documents?.prestasi?.pres_file)
  const hasOrganisasi =
    formData?.hasOrganisasi === 'ya' ||
    (detail?.documents?.organisasi && !!detail?.documents?.organisasi?.org_file)

  const student = {
    subId: detail?.sub_id,
    name: detail?.name || '',
    nim: detail?.nim || nim || '',
    prodi: 'Sistem Informasi',
    angkatan: detail?.angkatan ? String(detail.angkatan) : '-',
    initials: detail?.initials || (detail?.name ? detail.name.charAt(0) : 'M'),
    prestasi: {
      hasSubmitted: hasPrestasi,
      nama:
        detail?.documents?.prestasi?.pres_name ||
        formData?.namaPrestasi ||
        detail?.form_data?.prestasi_nama ||
        '-',
      tingkat: formatLevel(
        detail?.documents?.prestasi?.pres_level ||
          formData?.tingkatPrestasi ||
          detail?.form_data?.prestasi_tingkat
      ),
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
      fileName: detail?.documents?.prestasi?.pres_file || '',
      fileSize: detail?.documents?.prestasi?.pres_file
        ? 'Dokumen Terlampir'
        : '-',
      fileUrl: detail?.documents?.prestasi?.file_url,
    },
    organisasi: {
      hasSubmitted: hasOrganisasi,
      nama:
        detail?.documents?.organisasi?.org_name ||
        formData?.namaOrganisasi ||
        detail?.form_data?.organisasi_nama ||
        '-',
      tingkat: formatLevel(
        detail?.documents?.organisasi?.org_level ||
          formData?.tingkatOrganisasi ||
          detail?.form_data?.organisasi_tingkat
      ),
      jabatan: formatRole(
        detail?.documents?.organisasi?.org_position ||
          formData?.jabatan ||
          detail?.form_data?.organisasi_jabatan
      ),
      periode:
        detail?.documents?.organisasi?.org_period ||
        formData?.periode ||
        detail?.form_data?.organisasi_periode ||
        '-',
      fileName: detail?.documents?.organisasi?.org_file || '',
      fileSize: detail?.documents?.organisasi?.org_file
        ? 'Dokumen Terlampir'
        : '-',
      fileUrl: detail?.documents?.organisasi?.file_url,
    },
    bahasa: {
      hasSubmitted: hasBahasa,
      bahasa:
        detail?.documents?.bahasa?.bah_name || formData?.bahasa || '-',
      jenis: formatCertLevel(
        detail?.documents?.bahasa?.bah_type ||
          formData?.tingkatSertifikat ||
          formData?.bahasa_jenis
      ),
      skor:
        detail?.documents?.bahasa?.bah_score ||
        formData?.skor ||
        formData?.bahasa_skor ||
        '-',
      tanggalTes: formData?.tanggalTes || '-',
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
      fileName: detail?.documents?.bahasa?.bah_file || '',
      fileSize: detail?.documents?.bahasa?.bah_file
        ? 'Dokumen Terlampir'
        : '-',
      fileUrl: detail?.documents?.bahasa?.file_url,
    },
    scoreTahap1: detail?.score?.total_score
      ? Number(detail.score.total_score).toFixed(2)
      : '0.00',
  }

  const handleConfirmAction = async () => {
    if (modalType === 'revision' && student.subId) {
      try {
        await updateSubmissionStatus(student.subId, {
          status: 'revisi',
          notes:
            revisionNote ||
            'Periksa kembali kelengkapan dokumen pengajuan.',
        })
      } catch {
        // fallback
      }
      setModalType(null)
      setRevisionNote('')
      navigate('/admin/daftar-mapres')
      return
    }
    setModalType(null)
    setRevisionNote('')
  }

  const handleViewDocument = (fileName, fileSize, fileUrl) => {
    setSelectedDocument({
      fileName,
      fileSize,
      fileUrl,
    })
  }

  return (
    <AdminShell>
      {/* BACK */}
      <div className="verif-top-bar">
        <button
          type="button"
          className="verif-back-btn"
          onClick={() => navigate('/admin/daftar-mapres')}
        >
          <ArrowLeft size={15} />
          <span>Kembali ke Verifikasi Tahap 1</span>
        </button>
      </div>

      <div className="finexy-page-header">
        <div>
          <h1>Detail Pengajuan Mahasiswa</h1>
          <p>
            Lihat data akademik, dokumen pendukung, dan hasil verifikasi pengajuan mahasiswa.
          </p>
        </div>
      </div>

      {/* KARTU IDENTITAS */}
      <section className="verif-student-banner">
        <div className="verif-student-left">
          <div className="verif-avatar-circle">{student.initials}</div>
          <div>
            <h2>{student.name || '-'}</h2>
            <div className="verif-student-meta">
              <strong>NIM {student.nim}</strong>
              <span>•</span>
              <span>Program Studi {student.prodi}</span>
              <span>•</span>
              <span>Angkatan {student.angkatan}</span>
            </div>
          </div>
        </div>

        <span className="finexy-status-pill approved">Disetujui</span>
      </section>

      {/* DATA MAHASISWA */}
      <VerificationSection
        Icon={User}
        title="Data Akademik Mahasiswa"
        rightLabel="Data Terdaftar"
      >
        <div className="verif-info-grid cols-4">
          <InfoBox label="Nama Lengkap" value={student.name || '-'} />
          <InfoBox label="NIM" value={student.nim} />
          <InfoBox label="Program Studi" value={student.prodi} />
          <InfoBox label="Tahun Angkatan" value={student.angkatan} />
        </div>
      </VerificationSection>

      {/* PRESTASI */}
      <VerificationSection Icon={Award} title="Prestasi Terbaik">
        {student.prestasi.hasSubmitted ? (
          <>
            <div className="verif-info-grid cols-4">
              <InfoBox label="Nama Prestasi" value={student.prestasi.nama} />
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

            {student.prestasi.fileName && (
              <DocumentRow
                fileName={student.prestasi.fileName}
                fileSize={student.prestasi.fileSize}
                fileUrl={
                  student.subId
                    ? `/api/admin/document/${student.subId}/prestasi`
                    : ''
                }
                onView={handleViewDocument}
              />
            )}
          </>
        ) : (
          <div className="verif-empty-box">
            <strong>Tidak ada prestasi yang diajukan</strong>
            <p>Mahasiswa memilih tidak mengajukan dokumen prestasi pada Tahap 1.</p>
          </div>
        )}
      </VerificationSection>

      {/* ORGANISASI */}
      <VerificationSection Icon={Users} title="Keaktifan Organisasi">
        {student.organisasi.hasSubmitted ? (
          <>
            <div className="verif-info-grid cols-4">
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

            {student.organisasi.fileName && (
              <DocumentRow
                fileName={student.organisasi.fileName}
                fileSize={student.organisasi.fileSize}
                fileUrl={
                  student.subId
                    ? `/api/admin/document/${student.subId}/organisasi`
                    : ''
                }
                onView={handleViewDocument}
              />
            )}
          </>
        ) : (
          <div className="verif-empty-box">
            <strong>Tidak ada organisasi yang diajukan</strong>
            <p>Mahasiswa memilih tidak mengajukan dokumen organisasi pada Tahap 1.</p>
          </div>
        )}
      </VerificationSection>

      {/* BAHASA ASING */}
      <VerificationSection Icon={Globe} title="Sertifikat Bahasa Asing">
        {student.bahasa.hasSubmitted ? (
          <>
            <div className="verif-info-grid cols-3">
              <InfoBox label="Bahasa Asing" value={student.bahasa.bahasa} />
              <InfoBox
                label="Kategori Tingkat"
                value={student.bahasa.jenis}
              />
              <InfoBox
                label="Skor / Level"
                value={
                  <span className="verif-highlight-val">
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

            {student.bahasa.fileName && (
              <DocumentRow
                fileName={student.bahasa.fileName}
                fileSize={student.bahasa.fileSize}
                fileUrl={
                  student.subId
                    ? `/api/admin/document/${student.subId}/bahasa`
                    : ''
                }
                onView={handleViewDocument}
              />
            )}
          </>
        ) : (
          <div className="verif-empty-box">
            <strong>Tidak ada sertifikat bahasa asing yang diajukan</strong>
            <p>Mahasiswa memilih tidak mengajukan sertifikat bahasa asing pada Tahap 1.</p>
          </div>
        )}
      </VerificationSection>

      {/* RINGKASAN */}
      <VerificationSection Icon={ClipboardCheck} title="Ringkasan Penilaian Tahap 1">
        <div className="verif-summary-row">
          <div className="verif-checks-grid">
            <VerificationCheck label="Data Mahasiswa" />
            <VerificationCheck
              label="Prestasi Terbaik"
              status={
                student.prestasi.hasSubmitted
                  ? 'Terverifikasi'
                  : 'Tidak Diajukan'
              }
              neutral={!student.prestasi.hasSubmitted}
            />
            <VerificationCheck
              label="Organisasi"
              status={
                student.organisasi.hasSubmitted
                  ? 'Terverifikasi'
                  : 'Tidak Diajukan'
              }
              neutral={!student.organisasi.hasSubmitted}
            />
            <VerificationCheck
              label="Bahasa Asing"
              status={
                student.bahasa.hasSubmitted
                  ? 'Terverifikasi'
                  : 'Tidak Diajukan'
              }
              neutral={!student.bahasa.hasSubmitted}
            />
          </div>

          <div className="verif-score-card">
            <span>Skor Tahap 1</span>
            <strong>{student.scoreTahap1}</strong>
            <small>Dihitung otomatis dari berkas terverifikasi</small>
          </div>
        </div>
      </VerificationSection>

      {/* HASIL VERIFIKASI + TOMBOL MINTA REVISI */}
      <section className="verif-decision-bar">
        <div>
          <h3>Status Verifikasi Berkas</h3>
          <p>
            Pengajuan Tahap 1 mahasiswa telah diverifikasi. Anda tetap dapat meminta revisi jika ditemukan berkas yang perlu diperbaiki.
          </p>
        </div>

        <div className="verif-decision-btns">
          <button
            type="button"
            className="verif-btn-revise"
            onClick={() => setModalType('revision')}
          >
            <RotateCcw size={15} />
            <span>Minta Revisi</span>
          </button>

          <div className="verif-verified-badge">
            <CheckCircle2 size={16} />
            <span>Berkas Tahap 1 Disetujui</span>
          </div>
        </div>
      </section>

      <ActionModal
        open={modalType !== null}
        type={modalType}
        studentName={student.name}
        revisionNote={revisionNote}
        setRevisionNote={setRevisionNote}
        onClose={() => {
          setModalType(null)
          setRevisionNote('')
        }}
        onConfirm={handleConfirmAction}
      />

      <DocumentModal
        open={selectedDocument !== null}
        fileName={selectedDocument?.fileName || ''}
        fileSize={selectedDocument?.fileSize || ''}
        fileUrl={selectedDocument?.fileUrl || ''}
        onClose={() => setSelectedDocument(null)}
      />
    </AdminShell>
  )
}

export default LihatDetail
