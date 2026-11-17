import './DocumentModal.css'

function DocumentModal({
  open,
  fileName,
  fileSize,
  fileUrl,
  onClose,
}) {
  if (!open) return null

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="document-modal-overlay" onClick={onClose}>
      <div className="document-modal" onClick={(e) => e.stopPropagation()}>

        <div className="document-modal-header">
          <div>
            <h2>Preview Dokumen</h2>
            <p>
              Periksa dokumen sebelum melanjutkan proses verifikasi.
            </p>
          </div>

          <button
            type="button"
            className="document-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {fileUrl ? (
          <div className="document-preview-frame-container">
            <iframe
              src={fileUrl}
              title={fileName || 'Dokumen Preview'}
              className="document-preview-iframe"
            />
          </div>
        ) : (
          <div className="document-preview">
            <div className="document-preview-icon">
              PDF
            </div>
            <strong>{fileName}</strong>
            <span>{fileSize}</span>
            <p>
              Dokumen tidak dapat dimuat atau belum tersedia di server.
            </p>
          </div>
        )}

        <div className="document-modal-info">
          <span>✓</span>
          <div>
            <strong>Dokumen tersedia</strong>
            <p>
              {fileName} {fileSize ? `(${fileSize})` : ''} — File berhasil diunggah oleh mahasiswa dan siap diperiksa.
            </p>
          </div>
        </div>

        <div className="document-modal-actions">
          <button
            type="button"
            className="document-close-button"
            onClick={onClose}
          >
            Tutup
          </button>

          {fileUrl && (
            <button
              type="button"
              className="document-open-button"
              onClick={handleOpenInNewTab}
            >
              Buka Dokumen di Tab Baru ↗
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default DocumentModal
