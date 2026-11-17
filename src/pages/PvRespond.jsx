import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function PvRespond() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [answers, setAnswers] = useState({})
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Peran penilai state
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    fetch(`/api/pv-respond/${token}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Gagal memuat formulir.')
        setData(json.data)
        const initialRole = json.data?.role === 'dosen' ? 'Dosen' : 'Mahasiswa'
        setSelectedRole(initialRole)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleSelectScore = (questId, score) => {
    setAnswers((prev) => ({ ...prev, [questId]: score }))
  }

  const handleResetForm = () => {
    if (window.confirm('Kosongkan semua jawaban formulir?')) {
      setAnswers({})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!data?.questions) return

    const unanswered = data.questions.filter((q) => !answers[q.quest_id])
    if (unanswered.length > 0) {
      alert(`Pertanyaan ini wajib diisi (${unanswered.length} pertanyaan belum dijawab).`)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        answers: data.questions.map((q) => ({
          quest_id: Number(q.quest_id),
          score: Number(answers[q.quest_id]),
        })),
      }

      const res = await fetch(`/api/pv-respond/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Gagal mengirim jawaban.')

      setSubmitted(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: '16px', color: '#5f6368', fontSize: '15px', fontFamily: "'Titillium Web', sans-serif" }}>
          Memuat formulir...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, borderTop: '10px solid #d93025', padding: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#202124', margin: '0 0 12px' }}>Akses Formulir</h1>
            <p style={{ color: '#5f6368', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, borderTop: '10px solid #800020', padding: '28px 24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#202124', margin: '0 0 14px' }}>
              Form Penilaian Pradita Value – SIPRESTASI
            </h1>
            <p style={{ color: '#202124', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px' }}>
              Tanggapan Anda telah dicatat. Terima kasih atas penilaian yang Anda berikan.
            </p>
            <div style={{ fontSize: '14px', color: '#5f6368' }}>
              Universitas Pradita • SIPRESTASI
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* 1. GOOGLE FORMS HEADER CARD */}
        <div style={{ ...styles.card, borderTop: '10px solid #800020' }}>
          <h1 style={styles.formTitle}>
            Form Penilaian Pradita Value – SIPRESTASI
          </h1>
          
          <div style={styles.formDescription}>
            <p style={{ margin: '0 0 8px' }}>
              Formulir ini digunakan untuk menilai penerapan Pradita Value pada mahasiswa berdasarkan sikap, perilaku, tanggung jawab, serta interaksi selama kegiatan akademik maupun nonakademik.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              Penilaian dilakukan oleh teman mahasiswa, dosen, dan Kepala Program Studi (Kaprodi) berdasarkan pengalaman dan pengamatan masing-masing.
            </p>
            <p style={{ margin: 0 }}>
              Mohon mengisi setiap pertanyaan secara jujur dan objektif agar hasil penilaian dapat memberikan gambaran mengenai karakter dan perkembangan mahasiswa.
            </p>
          </div>

          <div style={styles.headerDivider} />

          {/* Account info bar */}
          <div style={styles.accountInfoBar}>
            <div>
              <span style={{ color: '#202124', fontWeight: 600 }}>{data?.reviewer}</span>
            </div>
            <span style={{ color: '#800020', fontSize: '13px', fontWeight: 600 }}>Ganti akun</span>
          </div>

          <div style={{ padding: '4px 24px 0', fontSize: '13px', color: '#5f6368' }}>
            Tidak dibagikan • Akun Anda akan dicatat saat Anda mengirimkan formulir ini
          </div>

          <div style={styles.headerDivider} />

          <div style={styles.requiredNotice}>
            * Menunjukkan pertanyaan yang wajib diisi
          </div>
        </div>

        {/* FORM FIELDS */}
        <form onSubmit={handleSubmit}>

          {/* 2. CARD: Email */}
          <div style={{ ...styles.card, padding: '24px' }}>
            <div style={styles.questionTitleRow}>
              <span style={styles.questionTitle}>Email</span>
              <span style={styles.asterisk}>*</span>
            </div>
            <div style={styles.readOnlyInput}>
              {data?.reviewer}
            </div>
          </div>

          {/* 3. CARD: Peran Penilai */}
          <div style={{ ...styles.card, padding: '24px' }}>
            <div style={styles.questionTitleRow}>
              <span style={styles.questionTitle}>Peran Penilai</span>
              <span style={styles.asterisk}>*</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              {['Mahasiswa', 'Dosen', 'Kaprodi'].map((role) => {
                const checked = selectedRole === role
                return (
                  <label
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ ...styles.radioOuter, borderColor: checked ? '#800020' : '#5f6368' }}>
                      {checked && <div style={styles.radioInner} />}
                    </div>
                    <span style={{ fontSize: '15px', color: '#202124' }}>{role}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 4. CARD: Nama Mahasiswa */}
          <div style={{ ...styles.card, padding: '24px' }}>
            <div style={styles.questionTitleRow}>
              <span style={styles.questionTitle}>Nama mahasiswa yang dinilai</span>
              <span style={styles.asterisk}>*</span>
            </div>
            <div style={styles.readOnlyInput}>
              {data?.student_name || 'Allegra Aretha Putri'}
            </div>
          </div>

          {/* 5. CARD: NIM Mahasiswa */}
          <div style={{ ...styles.card, padding: '24px' }}>
            <div style={styles.questionTitleRow}>
              <span style={styles.questionTitle}>NIM mahasiswa yang dinilai</span>
              <span style={styles.asterisk}>*</span>
            </div>
            <div style={styles.readOnlyInput}>
              {data?.student_nim || '2410102004'}
            </div>
          </div>

          {/* 6. SECTION HEADER: Penilaian Pradita Value */}
          <div style={{ ...styles.card, padding: '24px', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#202124', margin: '0 0 12px' }}>
              Penilaian Pradita Value
            </h2>
            <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.5, margin: '0 0 10px' }}>
              Berikan penilaian berdasarkan perilaku mahasiswa yang pernah Anda amati.
            </p>
            <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.5, margin: '0 0 8px', fontWeight: 600 }}>
              Gunakan skala berikut:
            </p>
            <ul style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.6, margin: '0 0 0 20px', padding: 0 }}>
              <li><strong>4 – Sangat Baik:</strong> Perilaku selalu atau sangat konsisten ditunjukkan.</li>
              <li><strong>3 – Baik:</strong> Perilaku sering ditunjukkan.</li>
              <li><strong>2 – Cukup Terlihat:</strong> Perilaku terkadang ditunjukkan.</li>
              <li><strong>1 – Kurang Terlihat:</strong> Perilaku jarang atau belum terlihat.</li>
            </ul>
          </div>

          {/* 7 - 16. THE 10 SCALE QUESTIONS */}
          {data?.questions?.map((q, idx) => {
            const isSelected = answers[q.quest_id] !== undefined
            const isActive = activeQuestion === q.quest_id
            const questionText = q.subhead || q.head

            return (
              <div
                key={q.quest_id}
                onClick={() => setActiveQuestion(q.quest_id)}
                style={{
                  ...styles.card,
                  borderLeft: isActive ? '5px solid #800020' : '1px solid #dadce0',
                  padding: '24px',
                }}
              >
                {/* Question title */}
                <div style={styles.questionTitleRow}>
                  <span style={styles.questionTitle}>
                    {questionText}
                  </span>
                  <span style={styles.asterisk}>*</span>
                </div>

                {/* Google Forms Linear Scale Layout */}
                <div style={styles.scaleContainer}>
                  <div style={styles.scaleRow}>
                    <div style={styles.scaleLabelLeft}>Kurang Terlihat</div>
                    
                    {[1, 2, 3, 4].map((score) => {
                      const checked = answers[q.quest_id] === score
                      return (
                        <label
                          key={score}
                          style={styles.scaleOption}
                          onClick={() => handleSelectScore(q.quest_id, score)}
                        >
                          <span style={styles.scaleNumber}>{score}</span>
                          <div style={{ ...styles.radioOuter, borderColor: checked ? '#800020' : '#5f6368' }}>
                            {checked && <div style={styles.radioInner} />}
                          </div>
                        </label>
                      )
                    })}

                    <div style={styles.scaleLabelRight}>Sangat Baik</div>
                  </div>
                </div>

                {/* Clear selection */}
                {isSelected && (
                  <div style={{ textAlign: 'right', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        const copy = { ...answers }
                        delete copy[q.quest_id]
                        setAnswers(copy)
                      }}
                      style={styles.clearQuestionBtn}
                    >
                      Hapus pilihan
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* 17. CLOSING NOTICE CARD */}
          <div style={{ ...styles.card, padding: '24px', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#202124', margin: '0 0 10px' }}>
              Terima Kasih atas Partisipasi Anda!
            </h2>
            <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.6, margin: '0 0 8px' }}>
              Terima kasih telah meluangkan waktu untuk mengisi Formulir Penilaian Pradita Value.
            </p>
            <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.6, margin: '0 0 8px' }}>
              Penilaian yang Anda berikan sangat berarti dalam membantu mengevaluasi penerapan nilai-nilai Pradita, yaitu Tata Krama, Rasa Syukur, Saling Menghormati, Integritas, serta Kasih Sayang dan Peduli Lingkungan.
            </p>
            <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.6, margin: 0 }}>
              Kami menghargai setiap penilaian dan masukan yang diberikan secara jujur dan objektif.
            </p>
          </div>

          {/* BOTTOM ACTIONS */}
          <div style={styles.bottomActions}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Mengirim...' : 'Kirim'}
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              style={styles.resetBtn}
            >
              Kosongkan formulir
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <div style={styles.footer}>
          <p style={{ margin: '0 0 6px' }}>
            Jangan pernah mengirimkan sandi melalui Google Formulir.
          </p>
          <div style={{ fontSize: '12px', color: '#5f6368', marginTop: '10px' }}>
            Formulir ini dibuat di dalam Sistem SIPRESTASI Universitas Pradita.
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#800020', marginTop: '16px' }}>
            SIPRESTASI • Pradita Value
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fcf4f5', // Soft warm burgundy-tinted background
    padding: '16px 12px 48px',
    fontFamily: "'Titillium Web', sans-serif",
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '640px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #dadce0',
    marginBottom: '12px',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.1)',
    transition: 'border 0.2s ease',
    fontFamily: "'Titillium Web', sans-serif",
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: 700, // BOLD
    color: '#800020', // Burgundy
    margin: '22px 24px 10px',
    lineHeight: 1.3,
    fontFamily: "'Titillium Web', sans-serif",
  },
  formDescription: {
    fontSize: '14px',
    color: '#202124',
    margin: '0 24px 16px',
    lineHeight: 1.5,
    fontFamily: "'Titillium Web', sans-serif",
  },
  headerDivider: {
    borderTop: '1px solid #dadce0',
    margin: '12px 24px',
  },
  accountInfoBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    fontSize: '14px',
  },
  requiredNotice: {
    padding: '0 24px 16px',
    color: '#d93025',
    fontSize: '13px',
    fontWeight: 600,
  },
  questionTitleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '4px',
    marginBottom: '8px',
  },
  questionTitle: {
    fontSize: '16px',
    fontWeight: 600, // Semi-bold for question titles
    color: '#202124',
    lineHeight: 1.45,
    fontFamily: "'Titillium Web', sans-serif",
  },
  asterisk: {
    color: '#d93025',
    fontSize: '16px',
    fontWeight: 700,
  },
  readOnlyInput: {
    padding: '8px 0',
    borderBottom: '1px solid #dadce0',
    fontSize: '15px',
    color: '#3c4043',
    marginTop: '6px',
    fontFamily: "'Titillium Web', sans-serif",
  },
  scaleContainer: {
    padding: '16px 8px 8px',
    marginTop: '8px',
  },
  scaleRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    maxWidth: '520px',
    margin: '0 auto',
  },
  scaleLabelLeft: {
    fontSize: '14px',
    color: '#5f6368',
    minWidth: '95px',
    textAlign: 'left',
    paddingBottom: '4px',
    fontWeight: 600,
  },
  scaleLabelRight: {
    fontSize: '14px',
    color: '#5f6368',
    minWidth: '85px',
    textAlign: 'right',
    paddingBottom: '4px',
    fontWeight: 600,
  },
  scaleOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px 8px',
    userSelect: 'none',
  },
  scaleNumber: {
    fontSize: '15px',
    color: '#202124',
    marginBottom: '10px',
    fontWeight: 600,
  },
  radioOuter: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #5f6368',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.15s ease',
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#800020', // Burgundy
  },
  clearQuestionBtn: {
    background: 'transparent',
    border: 'none',
    color: '#5f6368',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: "'Titillium Web', sans-serif",
  },
  bottomActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 4px 24px',
  },
  submitBtn: {
    backgroundColor: '#800020', // Burgundy #800020
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 28px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: "'Titillium Web', sans-serif",
    boxShadow: '0 1px 3px 0 rgba(128,0,32,0.35)',
  },
  resetBtn: {
    background: 'transparent',
    border: 'none',
    color: '#800020', // Burgundy #800020
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: "'Titillium Web', sans-serif",
    cursor: 'pointer',
    padding: '8px 12px',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#5f6368',
    marginTop: '16px',
    fontFamily: "'Titillium Web', sans-serif",
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcf4f5',
    fontFamily: "'Titillium Web', sans-serif",
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid rgba(128,0,32,0.2)',
    borderTopColor: '#800020',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}
