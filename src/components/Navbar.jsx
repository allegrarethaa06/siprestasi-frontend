import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function GraduationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10l10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
  )
}

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false)

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Pengajuan Baru',
      message:
        'Ahmad Rizky Pratama mengirim pengajuan Mahasiswa Berprestasi.',
      time: '5 menit lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Revisi Dikirim Ulang',
      message:
        'Kevin Jonathan telah mengirim ulang data yang diminta untuk direvisi.',
      time: '20 menit lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Tahap Seleksi',
      message:
        'Verifikasi Tahap 1 akan berakhir pada 28 Februari 2026.',
      time: '1 jam lalu',
      unread: true,
    },
    {
      id: 4,
      title: 'Pengajuan Baru',
      message:
        'Siti Nurhaliza mengirim pengajuan Mahasiswa Berprestasi.',
      time: '2 jam lalu',
      unread: false,
    },
    {
      id: 5,
      title: 'Revisi Dikirim Ulang',
      message:
        'Muhammad Farhan telah mengirim ulang dokumen revisi.',
      time: '3 jam lalu',
      unread: false,
    },
  ])

  const notificationCount =
    notifications.filter((item) => item.unread).length

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((item) => ({
        ...item,
        unread: false,
      }))
    )
  }

  const handleNotificationClick = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    )
  }

  return (
    <header className="admin-navbar">

      <div className="admin-brand">
        <div className="admin-brand-icon">
          <GraduationIcon />
        </div>

        <span>SIPRESTASI</span>
      </div>

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

      <div className="admin-user-area">

        <div className="notification-wrapper">

          <button
            type="button"
            className="notification-button"
            aria-label="Notifikasi"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
          >
            <BellIcon />

            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 9
                  ? '9+'
                  : notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <div>
                  <h3>Notifikasi</h3>

                  <span>
                    {notificationCount > 0
                      ? `${notificationCount} notifikasi baru`
                      : 'Tidak ada notifikasi baru'}
                  </span>
                </div>

                {notificationCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="notification-list">

                {notifications.map((item) => (
                  <button
                    type="button"
                    className={`notification-item ${
                      item.unread ? 'unread' : ''
                    }`}
                    key={item.id}
                    onClick={() =>
                      handleNotificationClick(item.id)
                    }
                  >

                    <div className="notification-item-icon">
                      {item.title === 'Pengajuan Baru'
                        ? '＋'
                        : item.title === 'Revisi Dikirim Ulang'
                          ? '↻'
                          : '◷'}
                    </div>

                    <div className="notification-item-content">

                      <div className="notification-item-title">
                        <strong>
                          {item.title}
                        </strong>

                        {item.unread && (
                          <span className="notification-unread-dot"></span>
                        )}
                      </div>

                      <p>
                        {item.message}
                      </p>

                      <span className="notification-time">
                        {item.time}
                      </span>

                    </div>

                  </button>
                ))}

              </div>

            </div>
          )}

        </div>

        <div className="admin-user-divider"></div>

        <div className="admin-avatar">
          AL
        </div>

        <div className="admin-user-info">
          <strong>Allegra Aretha Putri</strong>
          <span>2410102004</span>
        </div>

      </div>

    </header>
  )
}

export default Navbar