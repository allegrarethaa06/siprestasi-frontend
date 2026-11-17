import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Globe,
  MessageSquareWarning,
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

function TinjauRevisi() {
  const navigate = useNavigate()
  const { nim } = useParams()

  const [modalType, setModalType] = useState(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [resultMessage, setResultMessage] = useState('')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [detail, setDetail] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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
    revisionNotes:
      detail?.notes ||
      'Mohon unggah kembali dokumen pendukung dengan resolusi yang lebih jelas dan sesuai ketentuan.',
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

  const availableCategories = useMemo(() => {
    const list = []
    if (student?.prestasi?.fileName) {
      list.push({ id: 'prestasi', label: 'Prestasi & Penghargaan' })
    }
    if (student?.organisasi?.fileName) {
      list.push({ id: 'organisasi', label: 'Pengalaman Organisasi' })
    }
    if (student?.bahasa?.fileName) {
      list.push({ id: 'bahasa', label: 'Kemampuan Bahasa Asing' })
    }
    return list
  }, [
    student?.prestasi?.fileName,
    student?.organisasi?.fileName,
    student?.bahasa?.fileName,
  ])

  const handleConfirmAction = async () => {
    if (submitting) return
    if (modalType === 'approve') {
      setSubmitting(true)
      try {
        if (student.subId) {
          await updateSubmissionStatus(student.subId, {
            status: 'approved_tahap1',
          })
        }
      } catch {
        // fallback
      } finally {
        setSubmitting(false)
      }
      setModalType(null)
      setRevisionNote('')
      navigate('/admin/daftar-mapres')
      return
    }

    if (modalType === 'revision-again') {
      setSubmitting(true)
      try {
        if (student.subId) {
          await updateSubmissionStatus(student.subId, {
            status: 'revisi',
            categories: selectedCategories,
            notes:
              revisionNote ||
              'Periksa kembali kelengkapan dokumen pengajuan.',
          })
        }
      } catch {
        // fallback
      } finally {
        setSubmitting(false)
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
      {/* BACK BUTTON */}
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
          <h1>Tinjau Revisi Pengajuan</h1>
          <p>
            Periksa kembali data dan dokumen yang telah diperbaiki oleh mahasiswa.
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

        <span className="finexy-status-pill revision">Perlu Revisi</span>
      </section>

      {/* CATATAN REVISI SEBELUMNYA */}
      <VerificationSection
        Icon={MessageSquareWarning}
        title="Catatan Revisi Sebelumnya"
        rightLabel="Dikirim Admin"
      >
        <div className="verif-revision-note-box">
          <div className="verif-revision-note-copy">
            <span>Catatan untuk Mahasiswa</span>
            <p>{student.revisionNotes}</p>
          </div>
        </div>
      </VerificationSection>

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
                  ? 'Diajukan'
                  : 'Tidak Diajukan'
              }
              neutral={!student.prestasi.hasSubmitted}
            />
            <VerificationCheck
              label="Organisasi"
              status={
                student.organisasi.hasSubmitted
                  ? 'Diajukan'
                  : 'Tidak Diajukan'
              }
              neutral={!student.organisasi.hasSubmitted}
            />
            <VerificationCheck
              label="Bahasa Asing"
              status={
                student.bahasa.hasSubmitted
                  ? 'Diajukan'
                  : 'Tidak Diajukan'
              }
              neutral={!student.bahasa.hasSubmitted}
            />
          </div>

          <div className="verif-score-card">
            <span>Estimasi Skor Tahap 1</span>
            <strong>{student.scoreTahap1}</strong>
            <small>Dihitung otomatis berdasarkan berkas pengajuan</small>
          </div>
        </div>
      </VerificationSection>

      {/* KEPUTUSAN */}
      {!resultMessage && (
        <section className="verif-decision-bar">
          <div>
            <h3>Keputusan Tinjau Revisi</h3>
            <p>
              Tentukan hasil setelah memeriksa dokumen revisi yang dikirimkan mahasiswa.
            </p>
          </div>

          <div className="verif-decision-btns">
            <button
              type="button"
              className="verif-btn-revise"
              onClick={() => {
                setResultMessage('')
                setSelectedCategories(availableCategories.map((c) => c.id))
                setModalType('revision-again')
              }}
            >
              <RotateCcw size={15} />
              <span>Minta Revisi Lagi</span>
            </button>

            <button
              type="button"
              className="verif-btn-approve"
              onClick={() => {
                setResultMessage('')
                setModalType('approve')
              }}
            >
              <CheckCircle2 size={15} />
              <span>Setujui Pengajuan</span>
            </button>
          </div>
        </section>
      )}

      <ActionModal
        open={modalType !== null}
        type={modalType}
        studentName={student.name}
        revisionNote={revisionNote}
        setRevisionNote={setRevisionNote}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        submitting={submitting}
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

export default TinjauRevisi
