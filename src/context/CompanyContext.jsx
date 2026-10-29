import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/apiClient.js'

const CompanyContext = createContext(null)

export function CompanyProvider({ children }) {
  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [internships, setInternships] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshJobs = useCallback(async () => {
    const data = await api.get('/company/me/jobs')
    setJobs(data.jobs)
  }, [])
  const refreshInternships = useCallback(async () => {
    const data = await api.get('/company/me/internships')
    setInternships(data.internships)
  }, [])
  const refreshApplicants = useCallback(async () => {
    const data = await api.get('/company/me/applicants')
    setApplicants(data.applicants)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const me = await api.get('/auth/me')
        if (cancelled) return
        setUser(me.user)
        await Promise.all([refreshJobs(), refreshInternships(), refreshApplicants()])
        if (!cancelled) setLoading(false)
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('ruet_token')
          window.location.href = '/login'
        }
      }

    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshJobs, refreshInternships, refreshApplicants])

  const value = {
    user,
    setUser,
    loading,
    jobs,
    refreshJobs,
    internships,
    refreshInternships,
    applicants,
    refreshApplicants,
  }

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export function useCompany() {
  const ctx = useContext(CompanyContext)
  if (!ctx) throw new Error('useCompany must be used within a CompanyProvider')
  return ctx
}
