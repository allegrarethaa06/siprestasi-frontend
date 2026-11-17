import { useEffect, useState } from 'react'
import {
  fetchCurrentPeriod,
  savePeriodSchedule,
  openSelectionPeriod,
  closeSelectionPeriod,
} from '../../data/admin'
import './PeriodControlBanner.css'

export default function PeriodControlBanner({
  initialPeriod = null,
  onPeriodUpdated,
  embedded = false,
}) {
  const [period, setPeriod] = useState(initialPeriod)
  const [loading, setLoading] = useState(!initialPeriod)
  const [submitting, setSubmitting] = useState(false)
  const [modalMode, setModalMode] = useState(null) // 'close' | 'open' | 'schedule' | 'result'
  const [feedback, setFeedback] = useState(null)
  const [closeResult, setCloseResult] = useState(null)

  const [scheduleForm, setScheduleForm] = useState({
    tahun_ajaran: '2025/2026',
    tanggal_mulai: '',
    tanggal_selesai: '',
  })

  useEffect(() => {
    if (initialPeriod) {
      setPeriod(initialPeriod)
      setScheduleForm({
        tahun_ajaran: initialPeriod.tahun_ajaran || '2025/2026',
        tanggal_mulai: initialPeriod.tanggal_mulai || '',
        tanggal_selesai: initialPeriod.tanggal_selesai || '',
      })
      setLoading(false)
      return
    }

    let cancelled = false
    fetchCurrentPeriod()
      .then((res) => {
        if (!cancelled && res?.data) {
          setPeriod(res.data)
          setScheduleForm({
            tahun_ajaran: res.data.tahun_ajaran || '2025/2026',
            tanggal_mulai: res.data.tanggal_mulai || '',
            tanggal_selesai: res.data.tanggal_selesai || '',
          })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialPeriod])

  const isClosed = Boolean(
    period?.is_closed === true ||
      period?.is_closed === 1 ||
      period?.is_closed === '1' ||
      period?.is_closed === 't'
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleClosePeriod = async () => {
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await closeSelectionPeriod()
      const updated = res?.data?.periode || { ...period, is_closed: true }
      setPeriod(updated)
      setCloseResult({
        message: res?.message || 'Periode Tahap 1 resmi ditutup & Pradita Value telah dibuka.',
        finalists: res?.data?.finalists || [],
        emailsSent: res?.data?.emails_sent ?? 0,
      })
      setModalMode('result')
      if (onPeriodUpdated) onPeriodUpdated(updated, res?.data)
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Gagal menutup periode Tahap 1.',
      })
      setModalMode(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenPeriod = async () => {
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await openSelectionPeriod()
      const updated = res?.data || { ...period, is_closed: false }
      setPeriod(updated)
      setFeedback({
        type: 'success',
        text: 'Periode Tahap 1 dibuka kembali & Pradita Value dikunci.',
      })
      setModalMode(null)
      if (onPeriodUpdated) onPeriodUpdated(updated)
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Gagal membuka periode Tahap 1.',
      })
      setModalMode(null)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveSchedule = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)
    try {
      const res = await savePeriodSchedule(scheduleForm)
      const updated = res?.data || { ...period, ...scheduleForm }
      setPeriod(updated)
      setFeedback({
        type: 'success',
        text: 'Jadwal periode seleksi berhasil diperbarui.',
      })
      setModalMode(null)
      if (onPeriodUpdated) onPeriodUpdated(updated)
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err?.message || 'Gagal menyimpan jadwal periode.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className={embedded ? 'period-bar-embedded' : 'period-bar-standalone'}>
      <div className="period-bar-row">
        <div className="period-bar-left">
          <div className="period-bar-icon">
            {isClosed ? '✓' : '◷'}
          </div>
          <div className="period-bar-info">
            <div className="period-bar-title-line">
              <strong>
                {isClosed
                  ? 'Tahap 1 Ditutup — Pradita Value (Tahap 2) Dibuka'
                  : 'Periode Tahap 1 Sedang Berlangsung'}
              </strong>
              <span className={`period-mini-badge ${isClosed ? 'closed' : 'open'}`}>
                {isClosed ? 'TAHAP 2 AKTIF' : 'PRADITA VALUE TERKUNCI'}
              </span>
            </div>
            <span>
              TA {period?.tahun_ajaran || '2025/2026'} • {formatDate(period?.tanggal_mulai)} s/d{' '}
              {formatDate(period?.tanggal_selesai)} —{' '}
              {isClosed
                ? 'Finalis Top 3 telah ditetapkan dan dapat mengisi Rekan Sejawat.'
                : 'Persetujuan berkas mahasiswa belum membuka Pradita Value sebelum periode ditutup.'}
            </span>
          </div>
        </div>

        <div className="period-bar-buttons">
          <button
            type="button"
            className="period-action-btn outline"
            onClick={() => {
              setScheduleForm({
                tahun_ajaran: period?.tahun_ajaran || '2025/2026',
                tanggal_mulai: period?.tanggal_mulai || '',
                tanggal_selesai: period?.tanggal_selesai || '',
              })
              setModalMode('schedule')
            }}
          >
            Atur Jadwal
          </button>

          {isClosed ? (
            <button
              type="button"
              className="period-action-btn soft"
              onClick={() => setModalMode('open')}
            >
              Buka Kembali Tahap 1
            </button>
          ) : (
            <button
              type="button"
              className="period-action-btn primary"
              onClick={() => setModalMode('close')}
            >
              Tutup Tahap 1 &amp; Buka Pradita Value
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`period-inline-toast ${feedback.type}`}>
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)}>
            ✕
          </button>
        </div>
      )}

      {/* MODAL KONFIRMASI TUTUP TAHAP 1 (Mengikuti gaya ActionModal.css) */}
      {modalMode === 'close' && (
        <div className="period-modal-overlay" onClick={() => !submitting && setModalMode(null)}>
          <div className="period-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="period-modal-circle burgundy">✓</div>
            <h2>Tutup Periode Tahap 1?</h2>
            <p className="period-modal-desc">
              Periode verifikasi Tahap 1 akan dikunci dan sistem akan menetapkan{' '}
              <strong>Top 3 Mahasiswa per Angkatan</strong> untuk lanjut ke tahap{' '}
              <strong>Pradita Value</strong>.
            </p>

            <div className="period-info-box">
              <span>i</span>
              <p>
                Halaman <strong>Pradita Value</strong> akan dibuka bagi Finalis Top 3 dan{' '}
                <strong>Email Notifikasi Kelulusan Tahap 1</strong> akan dikirim otomatis.
              </p>
            </div>

            <div className="period-modal-btns">
              <button
                type="button"
                className="period-btn-cancel"
                disabled={submitting}
                onClick={() => setModalMode(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="period-btn-confirm"
                disabled={submitting}
                onClick={handleClosePeriod}
              >
                {submitting ? 'Memproses...' : '✓ Ya, Tutup & Buka Pradita Value'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI BUKA KEMBALI TAHAP 1 */}
      {modalMode === 'open' && (
        <div className="period-modal-overlay" onClick={() => !submitting && setModalMode(null)}>
          <div className="period-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="period-modal-circle amber">↻</div>
            <h2>Buka Kembali Tahap 1?</h2>
            <p className="period-modal-desc">
              Periode pendaftaran &amp; verifikasi Tahap 1 akan dibuka kembali untuk mahasiswa dan Admin.
            </p>

            <div className="period-info-box">
              <span>i</span>
              <p>
                Akses halaman <strong>Pradita Value</strong> pada akun mahasiswa akan{' '}
                <strong>dikunci kembali</strong> hingga periode Tahap 1 ditutup.
              </p>
            </div>

            <div className="period-modal-btns">
              <button
                type="button"
                className="period-btn-cancel"
                disabled={submitting}
                onClick={() => setModalMode(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="period-btn-confirm"
                disabled={submitting}
                onClick={handleOpenPeriod}
              >
                {submitting ? 'Memproses...' : 'Ya, Buka Tahap 1'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ATUR JADWAL PERIODE */}
      {modalMode === 'schedule' && (
        <div className="period-modal-overlay" onClick={() => !submitting && setModalMode(null)}>
          <div className="period-action-modal" onClick={(e) => e.stopPropagation()}>
            <div className="period-modal-circle burgundy">◷</div>
            <h2>Atur Jadwal Periode</h2>
            <p className="period-modal-desc">
              Perbarui tahun ajaran serta rentang tanggal pelaksanaan seleksi Tahap 1.
            </p>

            <form onSubmit={handleSaveSchedule} className="period-form-group">
              <div className="period-field">
                <label>Tahun Ajaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2025/2026"
                  value={scheduleForm.tahun_ajaran}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({ ...prev, tahun_ajaran: e.target.value }))
                  }
                />
              </div>

              <div className="period-field-grid">
                <div className="period-field">
                  <label>Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.tanggal_mulai}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({ ...prev, tanggal_mulai: e.target.value }))
                    }
                  />
                </div>

                <div className="period-field">
                  <label>Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.tanggal_selesai}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({ ...prev, tanggal_selesai: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="period-modal-btns">
                <button
                  type="button"
                  className="period-btn-cancel"
                  disabled={submitting}
                  onClick={() => setModalMode(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="period-btn-confirm"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HASIL PENETAPAN TOP 3 */}
      {modalMode === 'result' && closeResult && (
        <div className="period-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="period-action-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="period-modal-circle approve">✓</div>
            <h2>Tahap 2 (Pradita Value) Dibuka</h2>
            <p className="period-modal-desc">{closeResult.message}</p>

            {closeResult.finalists && closeResult.finalists.length > 0 ? (
              <div className="period-finalists-box">
                <div className="period-finalists-header">
                  <span>Finalis Top 3 yang Lolos Tahap 1</span>
                  <strong>{closeResult.emailsSent} Email Terkirim</strong>
                </div>
                <div className="period-finalists-scroll">
                  {closeResult.finalists.map((f) => (
                    <div key={f.sub_id} className="period-finalist-row">
                      <div className="period-finalist-meta">
                        <strong>
                          #{f.rank} {f.name}
                        </strong>
                        <span>
                          NIM {f.nim} • Angkatan {f.year} • {f.email}
                        </span>
                      </div>
                      <div className="period-finalist-badges">
                        <span className="period-score-pill">
                          {Number(f.total_score).toFixed(2)} Poin
                        </span>
                        <span className="period-mail-pill">
                          {f.email_sent ? '✓ Email Terkirim' : 'Tersimpan'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="period-info-box">
                <span>i</span>
                <p>
                  Belum ada pengajuan berstatus Disetujui yang dapat dimasukkan ke dalam Top 3.
                </p>
              </div>
            )}

            <div className="period-modal-btns">
              <button
                type="button"
                className="period-btn-confirm"
                onClick={() => setModalMode(null)}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
