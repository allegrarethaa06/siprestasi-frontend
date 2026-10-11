import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import './Navbar.css'

function GraduationCapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10 12 5l9 5-9 5-9-5Z" />
      <path d="M7 12.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-3.5" />
      <path d="M21 10v5" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function Navbar({ variant = 'default' }) {
  const navigate = useNavigate()
  
  const [showNotifications, setShowNotifications] =
    useState(false)

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pengajuan baru',
      message:
        'Ada pengajuan mahasiswa yang perlu ditinjau.',
      read: false,
    },
    {
      id: 2,
      title: 'Revisi dikirim ulang',
      message:
        'Mahasiswa telah mengirim kembali dokumen revisi.',
      read: false,
    },
    {
      id: 3,
      title: 'Pradita Value',
      message:
        'Data penilai finalis perlu diperiksa.',
      read: false,
    },
  ])

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  return (
    <header
      className={`admin-navbar ${
        variant === 'light' ? 'admin-navbar-light' : ''
      }`}
    >

      {/* BRAND */}
      <div className="admin-brand">

        <div className="admin-brand-icon">
          <GraduationCapIcon />
        </div>

        <span>
          SIPRESTASI
        </span>

      </div>

      {/* NAVIGATION */}
      <nav className="admin-nav-menu">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'admin-nav-link active'
              : 'admin-nav-link'
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/daftar-mapres"
          className={({ isActive }) =>
            isActive
              ? 'admin-nav-link active'
              : 'admin-nav-link'
          }
        >
          Daftar Mapres
        </NavLink>

        <NavLink
          to="/admin/pradita-value"
          className={({ isActive }) =>
            isActive
              ? 'admin-nav-link active'
              : 'admin-nav-link'
          }
        >
          Pradita Value
        </NavLink>

        <NavLink
          to="/admin/hasil-seleksi"
          className={({ isActive }) =>
            isActive
              ? 'admin-nav-link active'
              : 'admin-nav-link'
          }
        >
          Hasil Seleksi
        </NavLink>

      </nav>

      {/* RIGHT */}
      <div className="admin-nav-right">

        <div className="notification-wrapper">

          <button
            type="button"
            className="notification-button"
            aria-label="Notifikasi"
            onClick={() =>
              setShowNotifications(
                (current) => !current
              )
            }
          >
            <BellIcon />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">

                <div>
                  <strong>
                    Notifikasi
                  </strong>

                  <span>
                    {unreadCount} belum dibaca
                  </span>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                  >
                    Tandai semua dibaca
                  </button>
                )}

              </div>

              <div className="notification-list">

                {notifications.map(
                  (notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={
                        notification.read
                          ? 'notification-item read'
                          : 'notification-item'
                      }
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                    >

                      <span className="notification-dot" />

                      <div>
                        <strong>
                          {notification.title}
                        </strong>

                        <p>
                          {notification.message}
                        </p>
                      </div>

                    </button>
                  )
                )}

              </div>

            </div>
          )}

        </div>

        <div className="admin-user-divider" />

        <div
          className="admin-profile-trigger"
          onClick={() => navigate('/admin/profile')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              navigate('/admin/profile')
            }
          }}
        >
          <div className="admin-avatar">
            AL
          </div>

          <div className="admin-user-info">
            <strong>
              Allegra Aretha Putri
            </strong>

            <span>
              Administrator
            </span>
          </div>
        </div>

      </div>

    </header>
  )
}

export default Navbar