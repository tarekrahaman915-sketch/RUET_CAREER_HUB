import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import api from '../../services/apiClient.js'
import { useAuth, DASHBOARD_BY_ROLE } from '../../context/AuthContext.jsx'

const DEMO = [
  { label: 'Student', email: 'rafi.student@ruet.ac.bd', password: 'demo12345' },
  { label: 'Student (EEE)', email: 'nusrat.student@ruet.ac.bd', password: 'demo12345' },
  { label: 'Alumni', email: 'sadia.alumni@ruet.ac.bd', password: 'demo12345' },
  { label: 'Faculty', email: 'karim.faculty@ruet.ac.bd', password: 'demo12345' },
  { label: 'Recruiter', email: 'hr@nextwave.example', password: 'demo12345' },
  { label: 'Admin', email: 'admin@ruet.ac.bd', password: 'admin12345' },
]

export default function Login() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await api.post('/auth/login', form)
      await signIn(token, user)
      navigate(DASHBOARD_BY_ROLE[user.role] || '/')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h2>{t('auth_signInTitle')}</h2>
        <p className="auth-sub">{t('auth_signInSub')}</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <Input
            label={t('auth_email')}
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@ruet.ac.bd"
            required
          />
          <Input
            label={t('auth_password')}
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            required
          />
          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontSize: 12.5, color: 'var(--signal)' }}>
              {t('auth_forgotPassword')}
            </Link>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? 'Signing in…' : t('auth_signInBtn')}
          </Button>
        </form>
        {import.meta.env.DEV && (
          <div className="demo-box">
            <h4>Demo accounts (development only)</h4>
            <div className="demo-grid">
              {DEMO.map((d) => (
                <button key={d.email} type="button" onClick={() => setForm({ email: d.email, password: d.password })}>
                  {d.label}
                </button>
              ))}
            </div>
            <p className="demo-note">Fills the form. Create them with <code>npm run seed</code> in the server folder.</p>
          </div>
        )}
        <div className="auth-foot">
          {t('auth_newHere')} <Link to="/register">{t('auth_createProfileLink')}</Link>
        </div>
      </div>
    </main>
  )
}
