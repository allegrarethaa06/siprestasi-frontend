import { createContext, useContext } from 'react'
import { api } from '../api.js'

export const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

export async function fetchAdminSubmissions({ year, status, q } = {}) {
  const params = new URLSearchParams()
  if (year && year !== 'Semua') params.set('year', year)
  if (status && status !== 'Semua Status' && status !== 'Semua') params.set('status', status)
  if (q) params.set('q', q)
  const qs = params.toString()
  return api(`admin/pengajuan${qs ? '?' + qs : ''}`)
}

export async function fetchSubmissionDetail(idOrNim) {
  return api(`admin/pengajuan/${idOrNim}`)
}

export async function updateDocumentVerification(subId, category, { status, catatan } = {}) {
  return api(`pengajuan/${subId}/validasi/${category}`, {
    method: 'PUT',
    body: { status, catatan: catatan || '' },
  })
}

export async function updateSubmissionStatus(subId, { status, notes, categories } = {}) {
  return api(`admin/pengajuan/${subId}/status`, {
    method: 'PUT',
    body: { status, notes: notes || '', categories: categories || [] },
  })
}

export async function importStudentMaster(file, period = '2025/2026') {
  const body = new FormData()
  body.append('file', file)
  body.append('period', period)
  return api('master-data/import', { method: 'POST', body })
}

export async function fetchAdminFinalists() {
  return api('admin/pradita-value')
}

export async function fetchDosenList() {
  return api('admin/dosen')
}

export async function setLecturers(subId, { lecturer_reviewer_1, lecturer_reviewer_2 }) {
  return api(`pengajuan/${subId}/lecturer-reviewers`, {
    method: 'PUT',
    body: { lecturer_reviewer_1, lecturer_reviewer_2 },
  })
}

export async function sendPvInvitations(subId) {
  return api(`admin/pengajuan/${subId}/pv-send`, { method: 'POST' })
}

export async function fetchAdminLogs() {
  return api('admin/logs')
}

export async function fetchCurrentPeriod() {
  return api('periode/current')
}

export async function savePeriodSchedule({ tahun_ajaran, tanggal_mulai, tanggal_selesai }) {
  return api('periode', {
    method: 'POST',
    body: { tahun_ajaran, tanggal_mulai, tanggal_selesai },
  })
}

export async function openSelectionPeriod(body = {}) {
  return api('periode/open', {
    method: 'POST',
    body,
  })
}

export async function closeSelectionPeriod() {
  return api('periode/close', {
    method: 'POST',
  })
}
