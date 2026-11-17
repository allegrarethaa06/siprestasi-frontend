import { CheckCircle2, Info, RotateCcw } from 'lucide-react'
import './ActionModal.css'

function ActionModal({
  open,
  type,
  studentName,
  revisionNote,
  setRevisionNote,
  availableCategories = [],
  selectedCategories = [],
  setSelectedCategories,
  submitting = false,
  onClose,
  onConfirm,
}) {
  if (!open) return null

  const isApprove = type === 'approve'
  const isRevision = type === 'revision'
  const isRevisionAgain = type === 'revision-again'

  return (
    <div
      className="action-modal-overlay"
      onClick={submitting ? undefined : onClose}
    >
      <div className="action-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`action-modal-icon ${type}`}>
          {isApprove ? <CheckCircle2 size={22} /> : <RotateCcw size={22} />}
        </div>

        <h2>
          {isApprove
            ? 'Setujui Pengajuan Tahap 1?'
            : isRevisionAgain
              ? 'Minta Revisi Kembali?'
              : 'Minta Revisi Berkas?'}
        </h2>

        {isApprove && (
          <p className="action-modal-description">
            Pengajuan berkas dari <strong>{studentName}</strong> akan dinyatakan
            terverifikasi pada Tahap 1 dan masuk ke daftar pemeringkatan angkatan.
          </p>
        )}

        {(isRevision || isRevisionAgain) && (
          <>
            <p className="action-modal-description">
              Pilih dokumen yang perlu diperbaiki dan berikan catatan perbaikan.
              Dokumen lain yang tidak dipilih akan tetap disetujui secara otomatis.
            </p>

            {availableCategories &&
              availableCategories.length > 0 &&
              setSelectedCategories && (
                <div className="revision-cat-picker">
                  <label className="revision-cat-label">
                    Pilih Dokumen yang Harus Direvisi:
                  </label>
                  <div className="revision-cat-list">
                    {availableCategories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.id)
                      return (
                        <label
                          key={cat.id}
                          className={`revision-cat-item ${
                            isChecked ? 'selected' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  cat.id,
                                ])
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (id) => id !== cat.id
                                  )
                                )
                              }
                            }}
                          />
                          <span className="revision-cat-name">{cat.label}</span>
                        </label>
                      )
                    })}
                  </div>
                  {selectedCategories.length === 0 && (
                    <span className="revision-cat-error">
                      Pilih minimal satu dokumen yang perlu direvisi.
                    </span>
                  )}
                </div>
              )}

            <div className="revision-input-group">
              <label>Catatan Revisi untuk Mahasiswa</label>

              <textarea
                placeholder="Contoh: Mohon unggah kembali sertifikat organisasi dengan resolusi yang lebih jelas..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
              />

              <span>Catatan ini akan dikirimkan langsung ke akun &amp; email mahasiswa.</span>
            </div>

            <div className="approve-info" style={{ marginTop: '12px' }}>
              <span>
                <Info size={13} />
              </span>
              <p>
                Sistem akan otomatis mengirimkan email notifikasi ke mahasiswa berisi catatan revisi ini agar dapat segera diperbaiki.
              </p>
            </div>
          </>
        )}

        {isApprove && (
          <div className="approve-info">
            <span>
              <Info size={13} />
            </span>

            <p>
              Mahasiswa akan menerima notifikasi email bahwa berkas Tahap 1 telah{' '}
              <strong>Disetujui</strong>, dan menunggu penutupan periode untuk
              pengumuman Top 3 Pradita Value.
            </p>
          </div>
        )}

        <div className="action-modal-buttons">
          <button
            type="button"
            className="modal-cancel"
            disabled={submitting}
            onClick={onClose}
          >
            Batal
          </button>

          <button
            type="button"
            className={
              isApprove
                ? 'modal-confirm approve'
                : 'modal-confirm revision'
            }
            disabled={
              submitting ||
              (!isApprove &&
                (!revisionNote.trim() ||
                  (availableCategories &&
                    availableCategories.length > 0 &&
                    selectedCategories.length === 0)))
            }
            onClick={onConfirm}
          >
            {submitting
              ? isApprove
                ? 'Menyetujui...'
                : 'Mengirim...'
              : isApprove
                ? 'Ya, Setujui Pengajuan'
                : 'Kirim Permintaan Revisi'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionModal
