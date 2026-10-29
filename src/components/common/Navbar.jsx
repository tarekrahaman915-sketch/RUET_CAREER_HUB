import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import Logo from './Logo.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth, DASHBOARD_BY_ROLE } from '../../context/AuthContext.jsx'
import Avatar from '../ui/Avatar.jsx'

function AccountMenu({ onNavigate }) {
  const { user, signOut, unread } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dash = DASHBOARD_BY_ROLE[user.role] || '/'
  const go = (to) => {
    setOpen(false)
    onNavigate?.()
    navigate(to)
  }

  return (
    <div className="account" ref={ref}>
      <button className="account-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} title={user.email}>
        <Avatar person={user} size={34} />
        <span className="account-id">
          <b>{user.name}</b>
          <small>{user.email}</small>
        </span>
        {unread > 0 && <span className="badge-dot" aria-label={`${unread} unread messages`}>{unread > 9 ? '9+' : unread}</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="account-menu" role="menu">
          <div className="account-menu-head">
            <Avatar person={user} size={46} />
            <div style={{ minWidth: 0 }}>
              <b>{user.name}</b>
              <small>{user.email}</small>
              <span className="tag" style={{ marginTop: 6, display: 'inline-block' }}>{user.role}</span>
            </div>
          </div>
          <button role="menuitem" onClick={() => go(dash)}>Dashboard</button>
          {['Student', 'Alumni', 'Faculty'].includes(user.role) && (
            <>
              <button role="menuitem" onClick={() => go(`/people/${user._id}`)}>My public profile</button>
              <button role="menuitem" onClick={() => go(`${dash}/publications`)}>My publications</button>
            </>
          )}
          {user.role === 'Student' && <button role="menuitem" onClick={() => go('/student/career')}>My career plan</button>}
          {user.role !== 'Recruiter' && (
            <button role="menuitem" onClick={() => go('/messages')}>
              Messages {unread > 0 && <span className="badge-dot inline">{unread}</span>}
            </button>
          )}
          <button
            role="menuitem"
            className="danger"
            onClick={() => {
              signOut()
              setOpen(false)
              onNavigate?.()
              navigate('/')
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, isSignedIn, signOut, unread } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // Career paths, roadmaps and alumni mentors are student features; hidden for other signed-in roles.
  const studentOrVisitor = !isSignedIn || user?.role === 'Student'
  const { theme, resolvedTheme, toggleTheme } = useTheme()
  const { lang, toggleLang, t } = useLanguage()

  const linkClass = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <header className="site-header">
      <div className="wrap">
        <nav className="site-nav">
          <NavLink to="/" className="logo">
            <Logo />
            RUET Carrier HUB
          </NavLink>

          <div className="nav-links">
            <NavLink to="/jobs" className={linkClass}>{t('nav_jobs')}</NavLink>
            <NavLink to="/events" className={linkClass}>{t('nav_events')}</NavLink>
            <NavLink to="/research" className={linkClass}>{t('nav_research')}</NavLink>
            <NavLink to="/resources" className={linkClass}>{t('nav_resources')}</NavLink>
            <NavLink to="/companies" className={linkClass}>{t('nav_companies')}</NavLink>
            <NavLink to="/study-abroad" className={linkClass}>{t('nav_studyAbroad')}</NavLink>
            <NavLink to="/people" className={linkClass}>{t('nav_people')}</NavLink>
            {studentOrVisitor && <NavLink to="/mentors" className={linkClass}>{t('nav_mentors')}</NavLink>}
            {studentOrVisitor && <NavLink to="/careers" className={linkClass}>{t('nav_careers')}</NavLink>}
          </div>

          <div className="nav-cta">
            <button className="icon-toggle" onClick={toggleLang} aria-label="Toggle language" title="Toggle language">
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>
            <button
              className="icon-toggle"
              onClick={toggleTheme}
              aria-label={`Theme: ${theme}. Click to change.`}
              title={`Theme: ${theme[0].toUpperCase()}${theme.slice(1)} — click to change`}
            >
              {theme === 'system' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="13" rx="1.5" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ) : resolvedTheme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
                </svg>
              )}
            </button>
            {isSignedIn ? (
              <AccountMenu />
            ) : (
              <>
                <Button to="/login" variant="ghost">{t('nav_signIn')}</Button>
                <Button to="/register" variant="primary">{t('nav_createProfile')}</Button>
              </>
            )}
          </div>

          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </nav>

        <div className={`mobile-menu ${open ? 'open' : ''}`}>
          <NavLink to="/jobs" onClick={() => setOpen(false)}>{t('nav_jobs')}</NavLink>
          <NavLink to="/events" onClick={() => setOpen(false)}>{t('nav_events')}</NavLink>
          <NavLink to="/research" onClick={() => setOpen(false)}>{t('nav_research')}</NavLink>
          <NavLink to="/resources" onClick={() => setOpen(false)}>{t('nav_resources')}</NavLink>
          <NavLink to="/companies" onClick={() => setOpen(false)}>{t('nav_companies')}</NavLink>
          <NavLink to="/study-abroad" onClick={() => setOpen(false)}>{t('nav_studyAbroad')}</NavLink>
          <NavLink to="/people" onClick={() => setOpen(false)}>{t('nav_people')}</NavLink>
          {studentOrVisitor && <NavLink to="/mentors" onClick={() => setOpen(false)}>{t('nav_mentors')}</NavLink>}
          {studentOrVisitor && <NavLink to="/careers" onClick={() => setOpen(false)}>{t('nav_careers')}</NavLink>}
          {studentOrVisitor && <NavLink to="/roadmaps" onClick={() => setOpen(false)}>{t('nav_roadmaps')}</NavLink>}
          <NavLink to="/about" onClick={() => setOpen(false)}>{t('nav_about')}</NavLink>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="icon-toggle wide" onClick={toggleLang}>{lang === 'en' ? 'বাংলা' : 'English'}</button>
            <button className="icon-toggle wide" onClick={toggleTheme}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button>
          </div>
          {isSignedIn ? (
            <>
              <div className="mobile-account">
                <Avatar person={user} size={40} />
                <span><b>{user.name}</b><small>{user.email}</small></span>
              </div>
              <NavLink to={DASHBOARD_BY_ROLE[user.role] || '/'} onClick={() => setOpen(false)}>Dashboard</NavLink>
              {user.role !== 'Recruiter' && <NavLink to="/messages" onClick={() => setOpen(false)}>Messages{unread > 0 ? ` (${unread})` : ''}</NavLink>}
              <button className="icon-toggle wide" onClick={() => { signOut(); setOpen(false); navigate('/') }}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>{t('nav_signIn')}</NavLink>
              <Button to="/register" variant="primary" block>{t('nav_createProfile')}</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
