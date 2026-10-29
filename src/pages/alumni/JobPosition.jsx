import { useEffect, useState } from 'react'
import { useAlumni } from '../../context/AlumniContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

export default function JobPosition() {
  const { user, setUser } = useAlumni()
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        position: user.alumniProfile?.jobPosition?.position || '',
        company: user.alumniProfile?.jobPosition?.company || '',
        experience: user.alumniProfile?.jobPosition?.experience || '',
      })
    }
  }, [user])

  if (!form) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.patch('/alumni/me/job-position', form)
      setUser(res.user)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Current job position</h1>
        <p>Shown on your alumni profile, success timeline, and mentor directory.</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-grid form-row">
          <Input label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
          <Input label="Position / title" name="position" value={form.position} onChange={onChange} placeholder="Senior RF Engineer" />
          <Input label="Company" name="company" value={form.company} onChange={onChange} placeholder="Orbit Telecom" />
        </div>
        <div className="form-row">
          <label className="ui-field">
            <span className="ui-label">Experience</span>
            <textarea
              className="ui-input"
              name="experience"
              value={form.experience}
              onChange={onChange}
              rows={4}
              placeholder="A short summary of your career path since graduating"
            />
          </label>
        </div>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save →'}</Button>
        {saved && <span className="mono" style={{ marginLeft: 14, color: 'var(--signal)', fontSize: 13 }}>Saved ✓</span>}
      </form>
    </div>
  )
}
