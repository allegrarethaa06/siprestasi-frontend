import { useMemo, useState } from 'react'

import SuperadminNavbar from '../components/SuperadminNavbar'

import './KelolaPengguna.css'
import SuperadminHeader from '../components/SuperadminHeader'


function KelolaPengguna() {
  const initialUsers = [
    {
      id: 1,
      initials: 'AP',
      name: 'Allegra Aretha Putri',
      email: 'allegra.aretha@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '12 Okt 2026, 17:20',
    },
    {
      id: 2,
      initials: 'AS',
      name: 'Afifah Seruni',
      email: 'afifah.seruni@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '12 Okt 2026, 15:42',
    },
    {
      id: 3,
      initials: 'RD',
      name: 'Raka Dharma',
      email: 'raka.dharma@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '12 Okt 2026, 13:10',
    },
    {
      id: 4,
      initials: 'MN',
      name: 'Maya Nirmala',
      email: 'maya.nirmala@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '11 Okt 2026, 16:30',
    },
    {
      id: 5,
      initials: 'BS',
      name: 'Bima Saputra',
      email: 'bima.saputra@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '11 Okt 2026, 09:12',
    },
    {
      id: 6,
      initials: 'CN',
      name: 'Citra Nabila',
      email: 'citra.nabila@pradita.ac.id',
      role: 'Administrator',
      status: 'Nonaktif',
      lastActive: '05 Okt 2026, 14:25',
    },
    {
      id: 7,
      initials: 'DF',
      name: 'Dimas Fajar',
      email: 'dimas.fajar@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '10 Okt 2026, 11:18',
    },
    {
      id: 8,
      initials: 'SR',
      name: 'Salsa Rahma',
      email: 'salsa.rahma@pradita.ac.id',
      role: 'Administrator',
      status: 'Aktif',
      lastActive: '09 Okt 2026, 13:40',
    },
    {
      id: 9,
      initials: 'SA',
      name: 'Super Administrator',
      email: 'superadmin@pradita.ac.id',
      role: 'Superadmin',
      status: 'Aktif',
      lastActive: '12 Okt 2026, 18:40',
    },
  ]


  const [users, setUsers] = useState(initialUsers)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Semua Role')
  const [statusFilter, setStatusFilter] = useState('Semua Status')

  const [showUserModal, setShowUserModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingUser, setEditingUser] = useState(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)


  /* =========================
      FORM
  ========================= */

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Administrator',
  })


  /* =========================
      SUMMARY
  ========================= */

  const totalUsers = users.length

  const adminCount = users.filter(
    (user) => user.role === 'Administrator'
  ).length

  const superadminCount = users.filter(
    (user) => user.role === 'Superadmin'
  ).length

  const activeCount = users.filter(
    (user) => user.status === 'Aktif'
  ).length


  /* =========================
      FILTER
  ========================= */

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)

      const matchRole =
        roleFilter === 'Semua Role' ||
        user.role === roleFilter

      const matchStatus =
        statusFilter === 'Semua Status' ||
        user.status === statusFilter

      return matchSearch && matchRole && matchStatus
    })
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ])


  /* =========================
      ADD USER
  ========================= */

  const openAddModal = () => {
    setModalMode('add')
    setEditingUser(null)

    setFormData({
      name: '',
      email: '',
      role: 'Administrator',
    })

    setShowUserModal(true)
  }


  /* =========================
      EDIT USER
  ========================= */

  const openEditModal = (user) => {
    setModalMode('edit')
    setEditingUser(user)

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })

    setShowUserModal(true)
  }


  /* =========================
      SAVE USER
  ========================= */

  const handleSaveUser = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      return
    }


    if (modalMode === 'add') {
      const initials = formData.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()

      const newUser = {
        id: Date.now(),
        initials,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Aktif',
        lastActive: 'Belum pernah login',
      }

      setUsers((currentUsers) => [
        ...currentUsers,
        newUser,
      ])
    }


    if (modalMode === 'edit') {
      setUsers((currentUsers) =>
        currentUsers.map((user) => {
          if (user.id !== editingUser.id) {
            return user
          }

          const initials = formData.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()

          return {
            ...user,
            initials,
            name: formData.name,
            email: formData.email,
            role: formData.role,
          }
        })
      )
    }


    setShowUserModal(false)
  }


  /* =========================
      STATUS
  ========================= */

  const openStatusConfirm = (user) => {
    setSelectedUser(user)
    setShowConfirmModal(true)
  }


  const handleToggleStatus = () => {
    if (!selectedUser) {
      return
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              status:
                user.status === 'Aktif'
                  ? 'Nonaktif'
                  : 'Aktif',
            }
          : user
      )
    )

    setShowConfirmModal(false)
    setSelectedUser(null)
  }


  /* =========================
      RESET FILTER
  ========================= */

  const resetFilters = () => {
    setSearch('')
    setRoleFilter('Semua Role')
    setStatusFilter('Semua Status')
  }


  return (
    <div className="manage-users-page">

      {/* =========================
          TOP
      ========================= */}

      <div className="admin-top-section">

        <SuperadminNavbar />

        <SuperadminHeader
          title="Kelola Pengguna"
          description="Kelola akun administrator dan hak akses pengguna SIPRESTASI."
          metaStage="Manajemen Akun"
          metaInfo={`${totalUsers} pengguna terdaftar`}
          actionLabel="Tambah Pengguna"
          onActionClick={openAddModal}
        />

      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <main className="manage-users-content">


        {/* SUMMARY */}

        <section className="manage-users-summary-grid">

          <SummaryCard
            title="Total Pengguna"
            value={totalUsers}
            description="Seluruh akun terdaftar"
            icon={<UsersIcon />}
          />

          <SummaryCard
            title="Administrator"
            value={adminCount}
            description="Akun administrator"
            icon={<AdminIcon />}
          />

          <SummaryCard
            title="Superadmin"
            value={superadminCount}
            description="Akses penuh sistem"
            icon={<ShieldIcon />}
          />

          <SummaryCard
            title="Akun Aktif"
            value={activeCount}
            description="Pengguna aktif"
            icon={<ActiveIcon />}
          />

        </section>


        {/* =========================
            USER SECTION
        ========================= */}

        <section className="manage-users-section">

          <div className="manage-users-section-heading">

            <div>

              <h2>
                Daftar Pengguna
              </h2>

              <p>
                Kelola akun dan akses administrator SIPRESTASI.
              </p>

            </div>


            <span className="manage-users-count">
              {filteredUsers.length} Pengguna
            </span>

          </div>


          {/* FILTER */}

          <div className="manage-users-filter">

            <div className="manage-users-search">

              <SearchIcon />

              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option>
                Semua Role
              </option>

              <option>
                Administrator
              </option>

              <option>
                Superadmin
              </option>
            </select>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option>
                Semua Status
              </option>

              <option>
                Aktif
              </option>

              <option>
                Nonaktif
              </option>
            </select>


            <button
              type="button"
              className="manage-users-reset"
              onClick={resetFilters}
            >
              Reset Filter
            </button>

          </div>


          {/* TABLE */}

          <div className="manage-users-table-wrapper">

            <table className="manage-users-table">

              <thead>
                <tr>
                  <th>PENGGUNA</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>AKTIVITAS TERAKHIR</th>
                  <th>AKSI</th>
                </tr>
              </thead>


              <tbody>

                {filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>

                      <div className="manage-users-user">

                        <div className="manage-users-avatar">
                          {user.initials}
                        </div>

                        <strong>
                          {user.name}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {user.email}
                    </td>


                    <td>

                      <span
                        className={
                          user.role === 'Superadmin'
                            ? 'manage-users-role superadmin'
                            : 'manage-users-role'
                        }
                      >
                        {user.role}
                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          user.status === 'Aktif'
                            ? 'manage-users-status active'
                            : 'manage-users-status inactive'
                        }
                      >
                        <span />

                        {user.status}
                      </span>

                    </td>


                    <td>
                      {user.lastActive}
                    </td>


                    <td>

                      <div className="manage-users-actions">

                        <button
                          type="button"
                          className="manage-users-edit-button"
                          onClick={() =>
                            openEditModal(user)
                          }
                        >
                          Edit
                        </button>


                        {user.role !== 'Superadmin' && (
                          <button
                            type="button"
                            className={
                              user.status === 'Aktif'
                                ? 'manage-users-status-button deactivate'
                                : 'manage-users-status-button activate'
                            }
                            onClick={() =>
                              openStatusConfirm(user)
                            }
                          >
                            {user.status === 'Aktif'
                              ? 'Nonaktifkan'
                              : 'Aktifkan'}
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}


                {filteredUsers.length === 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="manage-users-empty"
                    >
                      Tidak ada pengguna yang sesuai dengan filter.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showUserModal && (
        <div className="manage-users-modal-overlay">

          <div className="manage-users-modal">

            <div className="manage-users-modal-header">

              <div>

                <h2>
                  {modalMode === 'add'
                    ? 'Tambah Pengguna'
                    : 'Edit Pengguna'}
                </h2>

                <p>
                  {modalMode === 'add'
                    ? 'Tambahkan akun baru ke SIPRESTASI.'
                    : 'Perbarui informasi dan role pengguna.'}
                </p>

              </div>


              <button
                type="button"
                className="manage-users-modal-close"
                onClick={() =>
                  setShowUserModal(false)
                }
              >
                ×
              </button>

            </div>


            <div className="manage-users-form">

              <label>

                <span>
                  Nama Lengkap
                </span>

                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                />

              </label>


              <label>

                <span>
                  Email
                </span>

                <input
                  type="email"
                  placeholder="nama@pradita.ac.id"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      email: event.target.value,
                    })
                  }
                />

              </label>


              <label>

                <span>
                  Role
                </span>

                <select
                  value={formData.role}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      role: event.target.value,
                    })
                  }
                >
                  <option>
                    Administrator
                  </option>

                  <option>
                    Superadmin
                  </option>
                </select>

              </label>

            </div>


            <div className="manage-users-modal-actions">

              <button
                type="button"
                className="manage-users-modal-cancel"
                onClick={() =>
                  setShowUserModal(false)
                }
              >
                Batal
              </button>


              <button
                type="button"
                className="manage-users-modal-save"
                disabled={
                  !formData.name.trim() ||
                  !formData.email.trim()
                }
                onClick={handleSaveUser}
              >
                {modalMode === 'add'
                  ? 'Tambah Pengguna'
                  : 'Simpan Perubahan'}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          CONFIRM STATUS
      ========================= */}

      {showConfirmModal && selectedUser && (
        <div className="manage-users-modal-overlay">

          <div className="manage-users-confirm-modal">

            <div className="manage-users-confirm-icon">
              <ShieldIcon />
            </div>

            <h2>
              {selectedUser.status === 'Aktif'
                ? 'Nonaktifkan Pengguna?'
                : 'Aktifkan Pengguna?'}
            </h2>

            <p>
              {selectedUser.status === 'Aktif'
                ? `Akun ${selectedUser.name} tidak dapat mengakses SIPRESTASI setelah dinonaktifkan.`
                : `Akun ${selectedUser.name} akan kembali mendapatkan akses ke SIPRESTASI.`}
            </p>


            <div className="manage-users-confirm-actions">

              <button
                type="button"
                className="manage-users-modal-cancel"
                onClick={() => {
                  setShowConfirmModal(false)
                  setSelectedUser(null)
                }}
              >
                Batal
              </button>


              <button
                type="button"
                className="manage-users-modal-save"
                onClick={handleToggleStatus}
              >
                {selectedUser.status === 'Aktif'
                  ? 'Ya, Nonaktifkan'
                  : 'Ya, Aktifkan'}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}


/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <article className="manage-users-summary-card">

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {description}
        </p>

      </div>


      <div className="manage-users-summary-icon">
        {icon}
      </div>

    </article>
  )
}


/* =========================
   ICONS
========================= */

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}


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
    </svg>
  )
}


function ShieldIcon() {
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
      <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}


function ActiveIcon() {
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
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.3 2.3 4.8-5" />
    </svg>
  )
}


export default KelolaPengguna