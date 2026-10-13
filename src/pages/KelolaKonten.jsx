import { useMemo, useState } from 'react'

import SuperadminNavbar from '../components/SuperadminNavbar'
import SuperadminHeader from '../components/SuperadminHeader'

import ContentFormModal from '../components/ContentFormModal'
import ContentDetailModal from '../components/ContentDetailModal'

import './KelolaKonten.css'


const initialContents = [
  {
    id: 1,
    title: 'Periode Seleksi Mahasiswa Berprestasi 2026',
    type: 'Informasi',
    description:
      'Informasi mengenai periode pelaksanaan seleksi Mahasiswa Berprestasi tahun 2026.',
    status: 'Aktif',
    updatedAt: '12 Okt 2026, 15:30',
  },
  {
    id: 2,
    title: 'Panduan Pengajuan Mahasiswa Berprestasi',
    type: 'Panduan',
    description:
      'Panduan pengajuan dan dokumen yang perlu dipersiapkan mahasiswa untuk mengikuti seleksi.',
    status: 'Aktif',
    updatedAt: '10 Okt 2026, 11:20',
  },
  {
    id: 3,
    title: 'Batas Waktu Verifikasi Tahap 1',
    type: 'Pengumuman',
    description:
      'Pengumuman mengenai batas waktu proses verifikasi berkas pada Tahap 1.',
    status: 'Aktif',
    updatedAt: '08 Okt 2026, 09:15',
  },
  {
    id: 4,
    title: 'Ketentuan Dokumen Pendukung',
    type: 'Panduan',
    description:
      'Ketentuan mengenai dokumen pendukung yang dapat digunakan dalam proses seleksi.',
    status: 'Aktif',
    updatedAt: '06 Okt 2026, 13:40',
  },
  {
    id: 5,
    title: 'Pengumuman Tahap Pradita Value',
    type: 'Pengumuman',
    description:
      'Informasi mengenai pelaksanaan dan ketentuan Tahap Pradita Value.',
    status: 'Draft',
    updatedAt: '05 Okt 2026, 16:20',
  },
  {
    id: 6,
    title: 'Informasi Hasil Seleksi Akhir',
    type: 'Informasi',
    description:
      'Informasi hasil akhir proses seleksi Mahasiswa Berprestasi.',
    status: 'Draft',
    updatedAt: '03 Okt 2026, 10:05',
  },
]


function KelolaKonten() {
  const [contents, setContents] = useState(initialContents)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] =
    useState('Semua Kategori')
  const [statusFilter, setStatusFilter] =
    useState('Semua Status')

  const [showFormModal, setShowFormModal] =
    useState(false)

  const [showDetailModal, setShowDetailModal] =
    useState(false)

  const [formMode, setFormMode] =
    useState('add')

  const [selectedContent, setSelectedContent] =
    useState(null)

  const [formData, setFormData] = useState({
    title: '',
    type: 'Informasi',
    description: '',
    status: 'Aktif',
  })


  /* =========================
     FILTER
  ========================= */

  const filteredContents = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return contents.filter((content) => {
      const matchSearch =
        content.title
          .toLowerCase()
          .includes(keyword)

      const matchCategory =
        categoryFilter === 'Semua Kategori' ||
        content.type === categoryFilter

      const matchStatus =
        statusFilter === 'Semua Status' ||
        content.status === statusFilter

      return (
        matchSearch &&
        matchCategory &&
        matchStatus
      )
    })
  }, [
    contents,
    search,
    categoryFilter,
    statusFilter,
  ])


  /* =========================
     SUMMARY
  ========================= */

  const activeCount = contents.filter(
    (content) => content.status === 'Aktif'
  ).length


  const draftCount = contents.filter(
    (content) => content.status === 'Draft'
  ).length


  const announcementCount = contents.filter(
    (content) => content.type === 'Pengumuman'
  ).length


  /* =========================
     RESET FILTER
  ========================= */

  const resetFilter = () => {
    setSearch('')
    setCategoryFilter('Semua Kategori')
    setStatusFilter('Semua Status')
  }


  /* =========================
     ADD
  ========================= */

  const openAddModal = () => {
    setFormMode('add')
    setSelectedContent(null)

    setFormData({
      title: '',
      type: 'Informasi',
      description: '',
      status: 'Aktif',
    })

    setShowFormModal(true)
  }


  /* =========================
     EDIT
  ========================= */

  const openEditModal = (content) => {
    setFormMode('edit')
    setSelectedContent(content)

    setFormData({
      title: content.title,
      type: content.type,
      description: content.description,
      status: content.status,
    })

    setShowDetailModal(false)
    setShowFormModal(true)
  }


  /* =========================
     DETAIL
  ========================= */

  const openDetailModal = (content) => {
    setSelectedContent(content)
    setShowDetailModal(true)
  }


  /* =========================
     SAVE
  ========================= */

  const handleSaveContent = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      return
    }


    if (formMode === 'add') {
      const newContent = {
        id: Date.now(),
        title: formData.title.trim(),
        type: formData.type,
        description:
          formData.description.trim(),
        status: formData.status,
        updatedAt: 'Baru saja',
      }

      setContents((current) => [
        newContent,
        ...current,
      ])
    }


    if (
      formMode === 'edit' &&
      selectedContent
    ) {
      setContents((current) =>
        current.map((content) =>
          content.id === selectedContent.id
            ? {
                ...content,
                title:
                  formData.title.trim(),
                type:
                  formData.type,
                description:
                  formData.description.trim(),
                status:
                  formData.status,
                updatedAt:
                  'Baru saja',
              }
            : content
        )
      )
    }


    setShowFormModal(false)
    setSelectedContent(null)
  }


  return (
    <div className="manage-content-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-top-section">

        <SuperadminNavbar />

        <SuperadminHeader
          title="Kelola Konten"
          description="Kelola informasi, panduan, dan pengumuman pada SIPRESTASI."
          metaStage="Manajemen Konten"
          metaInfo={`${contents.length} konten tersedia`}
          actionLabel="Tambah Konten"
          onActionClick={openAddModal}
        />

      </div>


      {/* =========================
          MAIN
      ========================= */}

      <main className="manage-content-main">

        {/* SUMMARY */}

        <section className="manage-content-summary-grid">

          <SummaryCard
            title="Total Konten"
            value={contents.length}
            description="Seluruh konten sistem"
            icon={<ContentIcon />}
          />

          <SummaryCard
            title="Konten Aktif"
            value={activeCount}
            description="Sedang ditampilkan"
            icon={<ActiveIcon />}
          />

          <SummaryCard
            title="Draft"
            value={draftCount}
            description="Belum dipublikasikan"
            icon={<DraftIcon />}
          />

          <SummaryCard
            title="Pengumuman"
            value={announcementCount}
            description="Konten pengumuman"
            icon={<AnnouncementIcon />}
          />

        </section>


        {/* =========================
            CONTENT SECTION
        ========================= */}

        <section className="manage-content-section">

          <div className="manage-content-section-heading">

            <div>

              <h2>
                Daftar Konten
              </h2>

              <p>
                Kelola konten informasi yang tersedia pada SIPRESTASI.
              </p>

            </div>


            <span className="manage-content-count">
              {filteredContents.length} Konten
            </span>

          </div>


          {/* =========================
              FILTER
          ========================= */}

          <div className="manage-content-filter">

            <div className="manage-content-search">

              <SearchIcon />

              <input
                type="text"
                placeholder="Cari judul konten..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>


            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
            >
              <option>Semua Kategori</option>
              <option>Informasi</option>
              <option>Panduan</option>
              <option>Pengumuman</option>
            </select>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Draft</option>
            </select>


            <button
              type="button"
              className="manage-content-reset"
              onClick={resetFilter}
            >
              Reset Filter
            </button>

          </div>


          {/* =========================
              TABLE
          ========================= */}

          <div className="manage-content-table-wrapper">

            <table className="manage-content-table">

              <thead>

                <tr>
                  <th>JUDUL KONTEN</th>
                  <th>KATEGORI</th>
                  <th>STATUS</th>
                  <th>TERAKHIR DIPERBARUI</th>
                  <th>AKSI</th>
                </tr>

              </thead>


              <tbody>

                {filteredContents.map(
                  (content) => (
                    <tr key={content.id}>

                      <td>

                        <div className="manage-content-title">

                          <div className="manage-content-title-icon">
                            <ContentIcon />
                          </div>

                          <strong>
                            {content.title}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <span className="manage-content-category">
                          {content.type}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            content.status ===
                            'Aktif'
                              ? 'manage-content-status active'
                              : 'manage-content-status draft'
                          }
                        >
                          <span />

                          {content.status}

                        </span>

                      </td>


                      <td>
                        {content.updatedAt}
                      </td>


                      <td>

                        <div className="manage-content-actions">

                          <button
                            type="button"
                            className="manage-content-detail-button"
                            onClick={() =>
                              openDetailModal(
                                content
                              )
                            }
                          >
                            Lihat
                          </button>


                          <button
                            type="button"
                            className="manage-content-edit-button"
                            onClick={() =>
                              openEditModal(
                                content
                              )
                            }
                          >
                            Edit
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}


                {filteredContents.length ===
                  0 && (
                  <tr>

                    <td
                      colSpan="5"
                      className="manage-content-empty"
                    >
                      Tidak ada konten yang sesuai dengan filter.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =========================
          FORM MODAL
      ========================= */}

      {showFormModal && (
        <ContentFormModal
          mode={formMode}
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setShowFormModal(false)
            setSelectedContent(null)
          }}
          onSave={handleSaveContent}
        />
      )}


      {/* =========================
          DETAIL MODAL
      ========================= */}

      {showDetailModal && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedContent(null)
          }}
          onEdit={openEditModal}
        />
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
    <article className="manage-content-summary-card">

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


      <div className="manage-content-summary-icon">
        {icon}
      </div>

    </article>
  )
}


/* =========================
   ICONS
========================= */

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
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  )
}


function ContentIcon() {
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
      <path d="M5 3h14v18H5z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
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
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path d="m8.5 12 2.3 2.3 4.8-5" />
    </svg>
  )
}


function DraftIcon() {
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
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  )
}


function AnnouncementIcon() {
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
      <path d="M3 11v2h4l9 4V7l-9 4H3Z" />
      <path d="M7 13v5" />
      <path d="M19 9c1 1 1 5 0 6" />
    </svg>
  )
}


export default KelolaKonten