import { useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { name: '', issuer: '', date: '', link: '' }

export default function Certifications() {
  const { user, setUser } = useStudent()
  const [form, setForm] = useState(EMPTY)

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>
  const certifications = user.studentProfile?.certifications || []

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const res = await api.post('/students/me/certifications', form)
    setUser(res.user)
    setForm(EMPTY)
  }

  const onRemove = async (certId) => {
    const res = await api.delete(`/students/me/certifications/${certId}`)
    setUser(res.user)
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Certifications</h1>
        <p>Courses, badges, and credentials worth showing on your profile.</p>
      </div>

      {certifications.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No certifications added yet.</p>
      )}

      {certifications.map((c) => (
        <div className="entry-card" key={c._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{c.name}</div>
              <div className="entry-meta">{[c.issuer, c.date].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(c._id)} aria-label="Remove certification">✕</button>
          </div>
          {c.link && (
            <div className="entry-links">
              <a href={c.link} target="_blank" rel="noreferrer">View credential ↗</a>
            </div>
          )}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">Add a certification</div>
        <form onSubmit={onSubmit}>
          <div className="form-grid form-row">
            <Input label="Name" name="name" value={form.name} onChange={onChange} placeholder="Embedded Systems Nanodegree" />
            <Input label="Issuer" name="issuer" value={form.issuer} onChange={onChange} placeholder="Coursera / edX / IEEE" />
            <Input label="Date" name="date" value={form.date} onChange={onChange} placeholder="March 2026" />
            <Input label="Credential link (optional)" name="link" value={form.link} onChange={onChange} placeholder="https://..." />
          </div>
          <Button type="submit" variant="primary">Add certification →</Button>
        </form>
      </div>
    </div>
  )
}
