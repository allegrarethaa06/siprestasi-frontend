import StudentTopbar from './student/StudentTopbar'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { api } from '../api'
import { mapPortal, PortalContext } from '../data/portal'

export default function PortalGate() {
  const location = useLocation()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    api('portal', { signal: controller.signal })
      .then(response => {
        setResult({ key: location.key, data: mapPortal(response.data) })
        setError(null)
      })
      .catch(reason => {
        if (reason.name !== 'AbortError') setError(reason)
      })
    return () => controller.abort()
  }, [location.key, attempt])

  if (error?.status === 401) return <Navigate to="/login" replace />
  if (error && !result) {
    return (
      <main className="dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p role="alert" style={{ color: '#b91c1c' }}>{error.message}</p>
        <button onClick={() => { setError(null); setAttempt(n => n + 1) }}>Coba lagi</button>
      </main>
    )
  }

  // Jika data pertama kali belum selesai dimuat, jangan flash teks mentah
  if (!result) return null

  const data = result.data
  if (
    (location.pathname.includes('finalis') || location.pathname.startsWith('/pradita-value')) &&
    !['top3', 'pending_reviewed', 'ranked'].includes(data.submission?.status)
  ) {
    return <Navigate to="/dashboard/ranking" replace />
  }

  return (
    <PortalContext.Provider value={data}>
      <StudentTopbar student={data.student} />
      <Outlet />
    </PortalContext.Provider>
  )
}
