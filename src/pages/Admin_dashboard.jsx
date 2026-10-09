import Navbar from '../components/Navbar'
import './Admin_dashboard.css'
import AdminHeader from '../components/AdminHeader'

function AdminDashboard() {
  const stats = [
    {
      title: 'Total Pengajuan',
      value: '42',
      note: 'Mahasiswa',
      icon: '▣',
    },
    {
      title: 'Perlu Ditinjau',
      value: '18',
      note: 'Menunggu verifikasi',
      icon: '◷',
    },
    {
      title: 'Perlu Revisi',
      value: '6',
      note: 'Menunggu perbaikan',
      icon: '✎',
    },
    {
      title: 'Disetujui',
      value: '16',
      note: 'Lolos verifikasi Tahap 1',
      icon: '✓',
    },
  ]

  const stages = [
    {
      number: 1,
      title: 'Verifikasi Tahap 1',
      description: 'Pemeriksaan administrasi berkas',
      status: 'SEDANG BERJALAN',
      active: true,
    },
    {
      number: 2,
      title: 'Ranking per Angkatan',
      description: 'Top 3 mahasiswa per angkatan',
      status: 'Menunggu',
    },
    {
      number: 3,
      title: 'Pradita Value',
      description: 'Penilaian karakter & wawancara',
      status: 'Belum Dimulai',
    },
    {
      number: 4,
      title: 'Hasil Akhir',
      description: 'Penetapan Juara 1, 2, dan 3',
      status: 'Belum Dimulai',
    },
  ]

  const actions = [
    {
      icon: '☑',
      title: '18 Pengajuan Menunggu Verifikasi',
      description:
        'Pengajuan baru membutuhkan pemeriksaan berkas Tahap 1.',
      button: 'Verifikasi',
      primary: true,
    },
    {
      icon: '↻',
      title: '2 Revisi Telah Dikirim Ulang',
      description:
        'Mahasiswa telah memperbarui data yang sebelumnya diminta untuk direvisi.',
      button: 'Tinjau Revisi',
    },
    {
      icon: '♙',
      title: 'Penugasan Pradita Value Belum Diselesaikan',
      description:
        'Penugasan Kaprodi dan Dosen Penilai dapat disiapkan sebelum Tahap 2 dimulai.',
      button: 'Lihat',
    },
  ]

  const submissions = [
    {
      name: 'Ahmad Rizky Pratama',
      nim: '13521048',
      year: '2025',
      status: 'Perlu Ditinjau',
      action: 'Verifikasi',
    },
    {
      name: 'Siti Nurhaliza',
      nim: '13521012',
      year: '2024',
      status: 'Disetujui',
      action: 'Lihat Detail',
    },
    {
      name: 'Kevin Jonathan',
      nim: '13522005',
      year: '2026',
      status: 'Perlu Revisi',
      action: 'Tinjau Revisi',
    },
    {
      name: 'Amanda Putri',
      nim: '13521089',
      year: '2025',
      status: 'Disetujui',
      action: 'Lihat Detail',
    },
    {
      name: 'Muhammad Farhan',
      nim: '13522033',
      year: '2026',
      status: 'Perlu Ditinjau',
      action: 'Verifikasi',
    },
  ]

  return (
    <div className="admin-dashboard">

      {/* NAVBAR */}
      <Navbar />

     <AdminHeader
        title="Selamat Datang di SIPRESTASI"
        description="Kelola proses seleksi Mahasiswa Berprestasi secara terstruktur dan efisien."
    />

      {/* =========================
          CONTENT
      ========================= */}

      <main className="admin-content">

        {/* =========================
            STAT CARDS
        ========================= */}

        <section className="stats-grid">

          {stats.map((item) => (
            <article
              className="stat-card"
              key={item.title}
            >

              <div className="stat-content">

                <span className="stat-title">
                  {item.title}
                </span>

                <strong className="stat-value">
                  {item.value}
                </strong>

                <span className="stat-note">
                  {item.note}
                </span>

              </div>

              <div className="stat-icon">
                {item.icon}
              </div>

            </article>
          ))}

        </section>

        {/* =========================
            TAHAP SELEKSI
        ========================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              <span className="heading-icon">
                ⌘
              </span>

              Tahap Seleksi
            </h2>

            <span>
              18 dari 42 pengajuan telah diverifikasi
            </span>

          </div>

          <div className="stage-grid">

            {stages.map((stage) => (
              <article
                key={stage.number}
                className={
                  stage.active
                    ? 'stage-card stage-active'
                    : 'stage-card'
                }
              >

                <div className="stage-top">

                  <strong>
                    {stage.number}. {stage.title}
                  </strong>

                  <span
                    className={
                      stage.active
                        ? 'stage-status active'
                        : 'stage-status'
                    }
                  >
                    {stage.status}
                  </span>

                </div>

                <p>
                  {stage.description}
                </p>

              </article>
            ))}

          </div>

        </section>

        {/* =========================
            PERLU TINDAKAN
        ========================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              <span className="heading-icon">
                ✓
              </span>

              Perlu Tindakan
            </h2>

            <span>
              3 Tindakan Membutuhkan Respon
            </span>

          </div>

          <div className="action-list">

            {actions.map((item) => (
              <div
                className="action-item"
                key={item.title}
              >

                <div className="action-icon">
                  {item.icon}
                </div>

                <div className="action-text">

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.description}
                  </span>

                </div>

                <button
                  type="button"
                  className={
                    item.primary
                      ? 'action-button primary'
                      : 'action-button'
                  }
                >
                  {item.button}
                </button>

              </div>
            ))}

          </div>

        </section>

        {/* =========================
            PENGAJUAN TERBARU
        ========================= */}

        <section className="dashboard-section submissions-section">

          <div className="submission-header">

            <div>
              <h2>
                Pengajuan Terbaru
              </h2>

              <p>
                Pengajuan mahasiswa terbaru yang masuk ke sistem.
              </p>
            </div>

            <button
              type="button"
              className="see-all-button"
            >
              Lihat Semua di Daftar Mapres →
            </button>

          </div>

          <div className="table-wrapper">

            <table className="submission-table">

              <thead>
                <tr>
                  <th>NAMA MAHASISWA</th>
                  <th>NIM</th>
                  <th>ANGKATAN</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>

              <tbody>

                {submissions.map((student) => (
                  <tr key={student.nim}>

                    <td className="student-name">
                      {student.name}
                    </td>

                    <td>
                      {student.nim}
                    </td>

                    <td>
                      {student.year}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          student.status === 'Disetujui'
                            ? 'approved'
                            : student.status === 'Perlu Revisi'
                              ? 'revision'
                              : 'review'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={
                          student.action === 'Verifikasi'
                            ? 'table-action primary'
                            : 'table-action'
                        }
                      >
                        {student.action}
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="admin-footer">
        © SIPRESTASI - Sistem Seleksi Mahasiswa Berprestasi Universitas.
      </footer>

    </div>
  )
}

export default AdminDashboard