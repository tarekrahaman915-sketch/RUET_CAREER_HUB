import { useCallback, useEffect, useState } from 'react'
import api from '../services/apiClient.js'
import { useAuth } from '../context/AuthContext.jsx'

const LS_KEY = 'ruet_career_plan'
const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || { primary: '', interests: [], progress: {} }
  } catch {
    return { primary: '', interests: [], progress: {} }
  }
}

/**
 * The person's chosen career path + ticked roadmap steps.
 * Signed in  -> saved to their account (follows them across devices).
 * Signed out -> kept in this browser only, so exploring works without an account.
 */
export default function useCareerPlan() {
  const { user, setUser, isSignedIn } = useAuth()
  const [local, setLocal] = useState(readLocal)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(local))
  }, [local])

  const useAccount = isSignedIn && user.role === 'Student'
  const plan = useAccount
    ? {
        primary: user.careerPath?.primary || local.primary || '',
        interests: user.careerPath?.interests?.length ? user.careerPath.interests : local.interests,
        progress: { ...local.progress, ...(user.roadmapProgress || {}) },
      }
    : local

  const canSave = !isSignedIn || user.role === 'Student'

  const choose = useCallback(
    async (pathId) => {
      setError('')
      if (!isSignedIn || user.role !== 'Student') return setLocal((p) => ({ ...p, primary: pathId }))
      try {
        const res = await api.patch('/profile/career-path', { primary: pathId })
        setUser(res.user)
      } catch (e) {
        // Server unreachable or not updated yet: keep the choice in this browser so the page still works.
        setLocal((p) => ({ ...p, primary: pathId }))
        setError('Saved on this device only: could not reach the server to save it to your profile. Restart the API and try again.')
      }
    },
    [isSignedIn, setUser]
  )

  const toggleInterest = useCallback(
    async (pathId) => {
      setError('')
      const has = plan.interests.includes(pathId)
      const interests = has ? plan.interests.filter((i) => i !== pathId) : [...plan.interests, pathId]
      if (!isSignedIn || user.role !== 'Student') return setLocal((p) => ({ ...p, interests }))
      try {
        const res = await api.patch('/profile/career-path', { interests })
        setUser(res.user)
      } catch (e) {
        setError(e.message)
      }
    },
    [isSignedIn, plan.interests, setUser]
  )

  const toggleStep = useCallback(
    async (pathId, stepId) => {
      setError('')
      const current = plan.progress[pathId] || []
      const steps = current.includes(stepId) ? current.filter((s) => s !== stepId) : [...current, stepId]
      if (!isSignedIn || user.role !== 'Student') return setLocal((p) => ({ ...p, progress: { ...p.progress, [pathId]: steps } }))
      // optimistic update, roll back on failure
      const before = user
      setUser({ ...user, roadmapProgress: { ...(user.roadmapProgress || {}), [pathId]: steps } })
      try {
        const res = await api.patch('/profile/roadmap-progress', { pathId, steps })
        setUser(res.user)
      } catch (e) {
        setUser(before)
        setLocal((p) => ({ ...p, progress: { ...p.progress, [pathId]: steps } }))
        setError('Progress saved on this device only (server unreachable).')
      }
    },
    [isSignedIn, plan.progress, user, setUser]
  )

  return { plan, choose, toggleInterest, toggleStep, canSave, isSignedIn, error }
}
