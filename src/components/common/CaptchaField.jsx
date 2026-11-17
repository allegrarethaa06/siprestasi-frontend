import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../api'
import './CaptchaField.css'

export default function CaptchaField({
  value,
  onChange,
  error,
  refreshKey = 0,
}) {
  const [svgData, setSvgData] = useState('')
  const [loading, setLoading] = useState(false)

  const loadCaptcha = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api('auth/captcha')
      setSvgData(res?.data?.svg || '')
    } catch {
      setSvgData('')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCaptcha()
  }, [loadCaptcha, refreshKey])

  return (
    <div className="captcha-field-group">
      <label className="captcha-field-label" htmlFor="login-captcha-input">
        Verifikasi Keamanan (CAPTCHA)
      </label>

      <div className="captcha-visual-row">
        <div className="captcha-image-box">
          {loading ? (
            <span className="captcha-loading-text">Memuat...</span>
          ) : svgData ? (
            <img src={svgData} alt="Kode CAPTCHA" draggable={false} />
          ) : (
            <span className="captcha-loading-text">Gagal memuat</span>
          )}
        </div>

        <button
          type="button"
          className="captcha-refresh-btn"
          title="Muat ulang kode CAPTCHA"
          aria-label="Muat ulang kode CAPTCHA"
          disabled={loading}
          onClick={() => {
            onChange('')
            loadCaptcha()
          }}
        >
          <RefreshCw size={17} />
        </button>
      </div>

      <div className="captcha-input-wrap">
        <input
          id="login-captcha-input"
          type="text"
          autoComplete="off"
          maxLength={5}
          placeholder="Masukkan 5 karakter di atas"
          value={value}
          className={error ? 'is-error' : ''}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
      </div>

      {error && <span className="captcha-error-text">{error}</span>}
    </div>
  )
}
