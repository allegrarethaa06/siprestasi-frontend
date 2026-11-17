import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { api } from '../api'
import { AdminContext } from '../data/admin'

export default function AdminGate() {
  const location = useLocation()
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('siprestasi_admin_profile')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    api('profile', { signal: controller.signal })
      .then(res => {
        if (res.data?.role !== 'admin' && res.data?.role !== 'superadmin') {
          const err = new Error('Akun ini bukan Administrator.')
          err.status = 403
          setError(err)
          localStorage.removeItem('siprestasi_admin_profile')
        } else {
          setProfile(res.data)
          localStorage.setItem('siprestasi_admin_profile', JSON.stringify(res.data))
          setError(null)
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          if (err.status === 401 || err.status === 403) {
            localStorage.removeItem('siprestasi_admin_profile')
          }
          setError(err)
        }
      })
    return () => controller.abort()
  }, [attempt])

  if (error?.status === 401 || error?.status === 403) {
    localStorage.removeItem('siprestasi_admin_profile')
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (error && !profile) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <p role="alert" style={{ color: '#b91c1c' }}>{error.message}</p>
        <button onClick={() => { setError(null); setAttempt(n => n + 1) }}>Coba lagi</button>
      </main>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <AdminContext.Provider value={{ user: profile, setProfile }}>
      <Outlet />
    </AdminContext.Provider>
  )
}
