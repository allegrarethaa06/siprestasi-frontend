import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoDashboard = () => {
    window.location.href = '/admin/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F9FAFB',
            fontFamily: "'Titillium Web', sans-serif",
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
              padding: '36px',
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '18px',
              }}
            >
              ⚠
            </div>

            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Terjadi Kendala Memuat Halaman
            </h2>

            <p
              style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              Sistem mendeteksi kendala pada tampilan ini. Silakan coba muat ulang halaman atau kembali ke Dashboard Administrator.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#7C0E44',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
              >
                Muat Ulang Halaman
              </button>

              <button
                type="button"
                onClick={this.handleGoDashboard}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Kembali ke Dashboard
              </button>
            </div>

            {this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  background: '#F3F4F6',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '12px',
                  color: '#374151',
                  marginTop: '16px',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 600, color: '#4B5563' }}>
                  Detail Teknis (Untuk Administrator / Debugging)
                </summary>
                <pre
                  style={{
                    marginTop: '8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#DC2626',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
