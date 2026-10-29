import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'ruet_theme'

const ThemeContext = createContext(null)

function loadInitialPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // storage unavailable — fall through to default
  }
  return 'system'
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : true
}

/**
 * `theme` is the user's stored preference: 'light' | 'dark' | 'system'.
 * `resolvedTheme` is always 'light' | 'dark' — what's actually applied to
 * the DOM (data-theme attribute), and what components should read if they
 * need to branch on light/dark rather than the raw preference.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadInitialPreference)
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    loadInitialPreference() === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : loadInitialPreference()
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage unavailable — theme still applies for this session
    }

    if (theme !== 'system') {
      setResolvedTheme(theme)
      return
    }

    // theme === 'system': resolve now, and keep resolving if the OS setting
    // changes while this tab is open.
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const applySystem = () => setResolvedTheme(mq.matches ? 'dark' : 'light')
    applySystem()
    mq.addEventListener('change', applySystem)
    return () => mq.removeEventListener('change', applySystem)
  }, [theme])

  useEffect(() => {
    // The stylesheet's dark palette is the :root default; only 'light'
    // needs an explicit attribute.
    if (resolvedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [resolvedTheme])

  // Cycles light -> dark -> system -> light. Kept as a single function so
  // every existing "toggle" button (Navbar, DashboardLayout) works as a
  // three-way switch without needing a dropdown.
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
