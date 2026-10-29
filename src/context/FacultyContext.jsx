import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/apiClient.js'

const FacultyContext = createContext(null)

export function FacultyProvider({ children }) {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [notices, setNotices] = useState([])
  const [researchOpportunities, setResearchOpportunities] = useState([])
  const [recommendedStudents, setRecommendedStudents] = useState([])
  const [recommendedInternships, setRecommendedInternships] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshEvents = useCallback(async () => {
    const data = await api.get('/faculty/me/events')
    setEvents(data.events)
  }, [])
  const refreshNotices = useCallback(async () => {
    const data = await api.get('/faculty/me/notices')
    setNotices(data.notices)
  }, [])
  const refreshResearchOpportunities = useCallback(async () => {
    const data = await api.get('/faculty/me/research-opportunities')
    setResearchOpportunities(data.opportunities)
  }, [])
  const refreshRecommendedStudents = useCallback(async () => {
    const data = await api.get('/faculty/me/recommended-students')
    setRecommendedStudents(data.recommendations)
  }, [])
  const refreshRecommendedInternships = useCallback(async () => {
    const data = await api.get('/faculty/me/recommended-internships')
    setRecommendedInternships(data.recommendations)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const me = await api.get('/auth/me')
        if (cancelled) return
        setUser(me.user)
        await Promise.all([
          refreshEvents(),
          refreshNotices(),
          refreshResearchOpportunities(),
          refreshRecommendedStudents(),
          refreshRecommendedInternships(),
        ])
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
  }, [refreshEvents, refreshNotices, refreshResearchOpportunities, refreshRecommendedStudents, refreshRecommendedInternships])

  const value = {
    user,
    loading,
    events,
    refreshEvents,
    notices,
    refreshNotices,
    researchOpportunities,
    refreshResearchOpportunities,
    recommendedStudents,
    refreshRecommendedStudents,
    recommendedInternships,
    refreshRecommendedInternships,
  }

  return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
}

export function useFaculty() {
  const ctx = useContext(FacultyContext)
  if (!ctx) throw new Error('useFaculty must be used within a FacultyProvider')
  return ctx
}
