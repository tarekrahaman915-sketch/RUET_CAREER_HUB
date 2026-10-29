import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../services/apiClient.js'

const AuthContext = createContext(null)

export const DASHBOARD_BY_ROLE = {
  Student: '/student',
  Alumni: '/alumni',
  Faculty: '/faculty',
  Recruiter: '/company',
  Admin: '/admin',
}

/**
 * One source of truth for "who is signed in on this browser?" — used by the
 * navbar (avatar + email), People directory, messaging and the career pages.
 * The JWT itself stays in localStorage ('ruet_token'), same as before.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('ruet_token')))
  const [unread, setUnread] = useState(0)

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('ruet_token')) {
      setUser(null)
      setUnread(0)
      setLoading(false)
      return null
    }
    try {
      const { user: me } = await api.get('/auth/me')
      setUser(me)
      localStorage.setItem('ruet_role', me.role)
      setLoading(false)
      api.get('/messages/unread-count').then((d) => setUnread(d.count)).catch(() => {})
      return me
    } catch (err) {
      // Expired/invalid token -> clear it. Network errors keep the token so a
      // flaky connection doesn't sign people out.
      if (err.status === 401) {
        localStorage.removeItem('ruet_token')
        localStorage.removeItem('ruet_role')
        setUser(null)
      }
      setLoading(false)
      return null
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Keep multiple tabs in sync (sign in / out in one tab updates the others).
  useEffect(() => {
    const onStorage = (e) => e.key === 'ruet_token' && refresh()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  // Light polling for the unread-message badge.
  useEffect(() => {
    if (!user) return
    const id = setInterval(() => {
      api.get('/messages/unread-count').then((d) => setUnread(d.count)).catch(() => {})
    }, 60000)
    return () => clearInterval(id)
  }, [user])

  const signIn = useCallback(
    async (token, userFromLogin) => {
      localStorage.setItem('ruet_token', token)
      localStorage.setItem('ruet_role', userFromLogin.role)
      setUser(userFromLogin)
      refresh()
    },
    [refresh]
  )

  const signOut = useCallback(() => {
    localStorage.removeItem('ruet_token')
    localStorage.removeItem('ruet_role')
    setUser(null)
    setUnread(0)
  }, [])

  const value = { user, setUser, loading, isSignedIn: Boolean(user), unread, setUnread, refresh, signIn, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
