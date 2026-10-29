import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { DEPARTMENTS } from '../../utils/departments.js'
import api from '../../services/apiClient.js'
import ProfilePicturePicker from '../../components/ui/ProfilePicturePicker.jsx'

const ROLES = ['Student', 'Alumni', 'Faculty', 'Recruiter']

export default function Register() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student', department: '' })
  const [picture, setPicture] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const roleLabelKey = { Student: 'role_student', Alumni: 'role_alumni', Faculty: 'role_faculty', Recruiter: 'role_recruiter' }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // multipart so the optional profile picture travels with the sign-up
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      if (picture) body.append('picture', picture)
      await api.upload('/auth/register', body)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <h2>Account created</h2>
          <p className="auth-sub">
            Your account is now waiting for admin approval. You'll be able to sign in once an admin verifies it —
            usually shown as a "Pending" entry on their Users page.
          </p>
          <div className="auth-foot">
            <Link to="/login">← Back to sign in</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h2>{t('auth_registerTitle')}</h2>
        <p className="auth-sub">{t('auth_registerSub')}</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <ProfilePicturePicker file={picture} onChange={setPicture} />
          <Input label={t('auth_fullName')} name="name" value={form.name} onChange={onChange} placeholder="Your name" required />
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
          <label className="ui-field">
            <span className="ui-label">{t('auth_iAmA')}</span>
            <select className="ui-input" name="role" value={form.role} onChange={onChange}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{t(roleLabelKey[r])}</option>
              ))}
            </select>
          </label>
          <label className="ui-field">
            <span className="ui-label">Department (optional)</span>
            <select className="ui-input" name="department" value={form.department} onChange={onChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? 'Creating…' : t('auth_registerBtn')}
          </Button>
        </form>
        <div className="auth-foot">
          {t('auth_alreadyHave')} <Link to="/login">{t('auth_signInLink')}</Link>
        </div>
      </div>
    </main>
  )
}
