import { useEffect, useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api, { fileUrl } from '../../services/apiClient.js'

const QR_PATTERN = [
  1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0,
  1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0,
]

export default function Portfolio() {
  const { user, setUser } = useStudent()
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setForm(user.studentProfile?.portfolio || { github: '', linkedin: '', website: '' })
  }, [user])

  if (!user || !form) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await api.patch('/students/me/portfolio', form)
    setUser(res.user)
    setSaved(true)
  }

  const isVerified = Boolean(user.name && user.studentProfile?.studentId)

  return (
    <div>
      <div className="dash-head">
        <h1>Portfolio & links</h1>
        <p>These power your public career profile and QR ID card.</p>
      </div>

      <div className="form-grid" style={{ alignItems: 'start', gap: 32 }}>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="GitHub" name="github" value={form.github} onChange={onChange} placeholder="https://github.com/you" />
            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/you" />
            <Input label="Personal portfolio website" name="website" value={form.website} onChange={onChange} placeholder="https://you.dev" />
          </div>
          <Button type="submit" variant="primary">Save links →</Button>
          {saved && <span className="mono" style={{ marginLeft: 14, color: 'var(--signal)', fontSize: 13 }}>Saved ✓</span>}
        </form>

        <div className="id-card">
          <div className="id-top">
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              RUET-CH / {user.studentProfile?.batch || '----'}
            </span>
            <span className="id-badge">{isVerified ? '✓ VERIFIED' : 'INCOMPLETE'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16 }}>
              {user.profilePicture ? (
                <img src={fileUrl(user.profilePicture.storedAs)} alt={user.name} />
              ) : (
                <span>{(user.name || '?').slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="id-name">{user.name || 'Your name'}</div>
          </div>
          <div className="id-role">
            {user.department ? user.department.replace(/\s*\([^)]*\)/, '') : 'RUET'}
            {user.studentProfile?.batch ? ` · Batch ${user.studentProfile.batch}` : ''}
          </div>
          <div className="qr">
            {QR_PATTERN.map((on, i) => (
              <div key={i} className={on ? 'on' : ''} />
            ))}
          </div>
          <div className="id-url">
            carrierhub.ruet/{(user.name || 'your-name').toLowerCase().replace(/\s+/g, '.')}
          </div>
        </div>
      </div>
    </div>
  )
}
