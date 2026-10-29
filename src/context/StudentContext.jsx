import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/apiClient.js'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [applications, setApplications] = useState([])
  const [mentorBookings, setMentorBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshProjects = useCallback(async () => {
    try {
      const data = await api.get('/students/me/projects')
      setProjects(data.projects)
    } catch {
      // leave previous state on transient errors
    }
  }, [])

  const refreshApplications = useCallback(async () => {
    try {
      const data = await api.get('/students/me/applications')
      setApplications(data.applications)
    } catch {
      // leave previous state on transient errors
    }
  }, [])

  const refreshMentorBookings = useCallback(async () => {
    try {
      const data = await api.get('/students/me/mentor-bookings')
      setMentorBookings(data.bookings)
    } catch {
      // leave previous state on transient errors
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const me = await api.get('/auth/me')
        if (cancelled) return
        setUser(me.user)
        await Promise.all([refreshProjects(), refreshApplications(), refreshMentorBookings()])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [refreshProjects, refreshApplications, refreshMentorBookings])

  // Rough profile-completeness score used by the Overview page.
  const completeness = (() => {
    if (!user) return 0
    const sp = user.studentProfile || {}
    const checks = [
      Boolean(user.name && user.department && sp.studentId && sp.semester && sp.gpa),
      sp.skills?.length > 0,
      sp.languages?.length > 0,
      Boolean(sp.documents?.cv),
      Boolean(sp.documents?.transcript),
      projects.length > 0,
      sp.certifications?.length > 0,
      Boolean(sp.portfolio?.github || sp.portfolio?.linkedin || sp.portfolio?.website),
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  })()

  const value = {
    user,
    setUser,
    loading,
    error,
    completeness,
    projects,
    refreshProjects,
    applications,
    refreshApplications,
    mentorBookings,
    refreshMentorBookings,
  }

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudent() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudent must be used within a StudentProvider')
  return ctx
}
