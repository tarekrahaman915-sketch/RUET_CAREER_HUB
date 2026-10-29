import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/apiClient.js'

const AlumniContext = createContext(null)

export function AlumniProvider({ children }) {
  const [user, setUser] = useState(null)
  const [postings, setPostings] = useState([])
  const [careerTips, setCareerTips] = useState([])
  const [successStories, setSuccessStories] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshCareerTips = useCallback(async () => {
    const data = await api.get('/alumni/me/career-tips')
    setCareerTips(data.tips)
  }, [])
  const refreshSuccessStories = useCallback(async () => {
    const data = await api.get('/alumni/me/success-stories')
    setSuccessStories(data.stories)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const me = await api.get('/auth/me')
        if (cancelled) return
        setUser(me.user)
        await Promise.all([refreshCareerTips(), refreshSuccessStories()])
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
  }, [refreshCareerTips, refreshSuccessStories])

  const value = {
    user,
    setUser,
    loading,
    postings,
    setPostings,
    careerTips,
    refreshCareerTips,
    successStories,
    refreshSuccessStories,
  }

  return <AlumniContext.Provider value={value}>{children}</AlumniContext.Provider>
}

export function useAlumni() {
  const ctx = useContext(AlumniContext)
  if (!ctx) throw new Error('useAlumni must be used within an AlumniProvider')
  return ctx
}
