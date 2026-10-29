import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompany } from '../../context/CompanyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

export default function Overview() {
  const { user, setUser, jobs, internships, applicants, loading } = useCompany()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  if (loading || !user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const newApplicants = applicants.filter((a) => a.status === 'New' || !a.status).length
  const items = [
    { label: 'Job postings', done: jobs.length > 0, to: '/company/jobs', note: `${jobs.length} live` },
    { label: 'Internship postings', done: internships.length > 0, to: '/company/internships', note: `${internships.length} live` },
    { label: 'Applicants', done: newApplicants === 0, to: '/company/applicants', note: `${applicants.length} total` },
  ]

  const onSave = async (e) => {
    e.preventDefault()
    const res = await api.patch('/company/me/profile', { companyName: name || user.companyProfile.companyName })
    setUser(res.user)
    setSaved(true)
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Company dashboard.</h1>
        <p>Manage postings and review applicants from RUET students and alumni.</p>
      </div>

      <div className="ui-card" style={{ marginBottom: 24 }}>
        <div className="ui-card-title">Company name</div>
        <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: '4px 0 14px' }}>
          Shown on every job and internship you post to the public Job Portal.
          {user.companyProfile.companyName && <> Currently: <strong>{user.companyProfile.companyName}</strong></>}
        </p>
        <form onSubmit={onSave} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false) }}
              placeholder={user.companyProfile.companyName || 'Your company name'}
            />
          </div>
          <Button type="submit" variant="primary">Save</Button>
          {saved && <span className="mono" style={{ color: 'var(--signal)', fontSize: 13 }}>Saved ✓</span>}
        </form>
      </div>

      <div className="quick-grid">
        {items.map((item) => (
          <Link to={item.to} className="quick-link" key={item.label}>
            <span className="label">{item.label}</span>
            <span className={`status ${item.done ? 'done' : ''}`}>{item.note}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
