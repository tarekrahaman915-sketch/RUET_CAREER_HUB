import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/apiClient.js'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [users, setUsers] = useState([])
  const [verifiedCompanies, setVerifiedCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [events, setEvents] = useState([])
  const [reports, setReports] = useState([])
  const [verificationRequests, setVerificationRequests] = useState([])
  const [messages, setMessages] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUsers = useCallback(async () => setUsers((await api.get('/admin/users')).users), [])
  const refreshVerifiedCompanies = useCallback(async () => setVerifiedCompanies((await api.get('/admin/verified-companies')).companies), [])
  const refreshJobs = useCallback(async () => setJobs((await api.get('/admin/jobs')).jobs), [])
  const refreshEvents = useCallback(async () => setEvents((await api.get('/admin/events')).events), [])
  const refreshReports = useCallback(async () => setReports((await api.get('/admin/reports')).reports), [])
  const refreshVerificationRequests = useCallback(async () => setVerificationRequests((await api.get('/admin/verification-requests')).requests), [])
  const refreshMessages = useCallback(async () => setMessages((await api.get('/admin/messages')).messages), [])
  const refreshAnalytics = useCallback(async () => setAnalytics(await api.get('/admin/analytics')), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      await Promise.all([
        refreshUsers(),
        refreshVerifiedCompanies(),
        refreshJobs(),
        refreshEvents(),
        refreshReports(),
        refreshVerificationRequests(),
        refreshMessages(),
        refreshAnalytics(),
      ])
      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshUsers, refreshVerifiedCompanies, refreshJobs, refreshEvents, refreshReports, refreshVerificationRequests, refreshMessages, refreshAnalytics])

  const setUserStatus = async (id, status) => {
    await api.patch(`/admin/users/${id}/status`, { status })
    refreshUsers()
  }

  const toggleVerifiedCompany = async (name) => {
    await api.post(`/admin/verified-companies/${encodeURIComponent(name)}/toggle`)
    refreshVerifiedCompanies()
  }

  const removeJob = async (id) => {
    await api.delete(`/admin/jobs/${id}`)
    refreshJobs()
  }

  const removeEvent = async (id) => {
    await api.delete(`/admin/events/${id}`)
    refreshEvents()
  }

  const resolveReport = async (id) => {
    await api.patch(`/admin/reports/${id}/resolve`)
    refreshReports()
  }

  const setVerificationStatus = async (id, status) => {
    await api.patch(`/admin/verification-requests/${id}/status`, { status })
    refreshVerificationRequests()
  }

  const value = {
    loading,
    users,
    setUserStatus,
    verifiedCompanies,
    toggleVerifiedCompany,
    jobs,
    removeJob,
    events,
    removeEvent,
    reports,
    resolveReport,
    verificationRequests,
    setVerificationStatus,
    messages,
    analytics,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within an AdminProvider')
  return ctx
}
