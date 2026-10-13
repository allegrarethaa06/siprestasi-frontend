import SuperadminNavbar from '../components/SuperadminNavbar'
import SuperadminHeader from '../components/SuperadminHeader'
import './SuperadminDashboard.css'
import { useNavigate } from 'react-router-dom'


function SuperadminDashboard() {
  const navigate = useNavigate()
  const stats = [
    {
      title: 'Total Pengguna',
      value: '128',
      description: 'Akun aktif di SIPRESTASI',
      icon: <UsersIcon />,
    },
    {
      title: 'Data Mahasiswa',
      value: '350',
      description: 'Mahasiswa terdaftar',
      icon: <StudentIcon />,
    },
    {
      title: 'Administrator',
      value: '8',
      description: 'Admin aktif',
      icon: <AdminIcon />,
    },
    {
      title: 'Konten Aktif',
      value: '24',
      description: 'Konten tersedia',
      icon: <ContentIcon />,
    },
  ]


  const activities = [
    {
      title: 'Data mahasiswa diperbarui',
      description: '350 data mahasiswa berhasil diproses.',
      time: 'Hari ini, 15:40',
    },
    {
      title: 'Administrator baru ditambahkan',
      description: '1 akun administrator berhasil dibuat.',
      time: 'Hari ini, 13:20',
    },
    {
      title: 'Konten sistem diperbarui',
      description: 'Informasi periode seleksi telah diperbarui.',
      time: 'Kemarin, 16:10',
    },
  ]


  return (
    <div className="superadmin-dashboard">

      {/* =========================
          TOP SECTION
      ========================= */}

      <div className="admin-top-section">

        <SuperadminNavbar />

        <SuperadminHeader
            title="Selamat Datang di SIPRESTASI"
            description="Kelola pengguna, data mahasiswa, dan informasi sistem dari satu tempat."
            metaStage="Portal Superadmin"
            metaInfo="Super Administrator"
        />

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <main className="superadmin-content">

        {/* SUMMARY */}

        <section className="superadmin-stats-grid">

          {stats.map((item) => (
            <article
              className="superadmin-stat-card"
              key={item.title}
            >

              <div>

                <span className="superadmin-stat-title">
                  {item.title}
                </span>

                <strong>
                  {item.value}
                </strong>

                <p>
                  {item.description}
                </p>

              </div>


              <div className="superadmin-stat-icon">
                {item.icon}
              </div>

            </article>
          ))}

        </section>


        {/* MANAGEMENT */}

        <section className="superadmin-section">

          <div className="superadmin-section-heading">

            <div>

              <h2>
                Kelola Sistem
              </h2>

              <p>
                Akses cepat untuk pengelolaan data SIPRESTASI.
              </p>

            </div>

          </div>


          <div className="superadmin-management-grid">

            <ManagementCard
                icon={<UsersIcon />}
                title="Kelola Pengguna"
                description="Kelola akun administrator dan hak akses pengguna."
                onClick={() => navigate('/superadmin/kelola-pengguna')}
            />

            <ManagementCard
                icon={<StudentIcon />}
                title="Kelola Mahasiswa"
                description="Kelola data mahasiswa yang terdaftar pada sistem."
                onClick={() => navigate('/superadmin/kelola-mahasiswa')}
            />

            <ManagementCard
                icon={<ContentIcon />}
                title="Kelola Konten"
                description="Kelola informasi dan konten yang digunakan SIPRESTASI."
                onClick={() => navigate('/superadmin/kelola-konten')}
            />

          </div>

        </section>


        {/* ACTIVITY */}

        <section className="superadmin-section">

          <div className="superadmin-section-heading">

            <div>

              <h2>
                Aktivitas Terbaru
              </h2>

              <p>
                Riwayat aktivitas terbaru pada sistem.
              </p>

            </div>

          </div>


          <div className="superadmin-activity-list">

            {activities.map((item) => (
              <div
                className="superadmin-activity-item"
                key={item.title}
              >

                <div className="superadmin-activity-dot" />


                <div className="superadmin-activity-copy">

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.description}
                  </span>

                </div>


                <time>
                  {item.time}
                </time>

              </div>
            ))}

          </div>

        </section>

      </main>


      <footer className="superadmin-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa Berprestasi Universitas.
      </footer>

    </div>
  )
}


function ManagementCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
        type="button"
        className="superadmin-management-card"
        onClick={onClick}
    >

      <div className="superadmin-management-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

      </div>

      <span className="superadmin-management-arrow">
        →
      </span>

    </button>
  )
}


/* =========================
   ICONS
========================= */

function UsersIcon() {
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
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.5-3 2.5-5 5.5-5s5 2 5.5 5" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M15.5 14.5c2.8-.8 5 .8 5.5 3.5" />
    </svg>
  )
}


function StudentIcon() {
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
      <path d="m3 8 9-5 9 5-9 5-9-5Z" />
      <path d="M7 11v4c3 2 7 2 10 0v-4" />
      <path d="M21 8v6" />
    </svg>
  )
}


function AdminIcon() {
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
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6" />
      <path d="M18 5h3v3" />
    </svg>
  )
}


function ContentIcon() {
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
      <path d="M5 3h14v18H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  )
}


export default SuperadminDashboard