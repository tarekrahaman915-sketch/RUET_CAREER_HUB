import { useState } from 'react'
import { useCompany } from '../../context/CompanyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', location: '', type: 'Full-time', experience: 'Entry-level', salary: '', deadline: '', description: '' }

export default function PostJobs() {
  const { jobs, refreshJobs } = useCompany()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/jobs', { ...form, category: 'Job' })
    setForm(EMPTY)
    refreshJobs()
  }

  const onRemove = async (id) => {
    await api.delete(`/jobs/${id}`)
    refreshJobs()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Post a job</h1>
        <p>Live postings show up in the public job portal.</p>
      </div>

      {jobs.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No jobs posted yet.</p>
      )}

      {jobs.map((j) => (
        <div className="entry-card" key={j._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{j.title}</div>
              <div className="entry-meta">{[j.type, j.experience, j.location, j.salary].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(j._id)} aria-label="Remove job">✕</button>
          </div>
          {j.description && <p className="entry-desc">{j.description}</p>}
          {j.deadline && <div className="entry-meta">Deadline: {j.deadline}</div>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New job posting</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-grid">
              <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Embedded Systems Engineer" />
              <Input label="Location" name="location" value={form.location} onChange={onChange} placeholder="Dhaka / Remote" />
            </div>
            <div className="form-grid">
              <label className="ui-field">
                <span className="ui-label">Type</span>
                <select className="ui-input" name="type" value={form.type} onChange={onChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </label>
              <Input label="Salary (optional)" name="salary" value={form.salary} onChange={onChange} placeholder="Negotiable" />
            </div>
            <div className="form-grid">
              <label className="ui-field">
                <span className="ui-label">Experience level</span>
                <select className="ui-input" name="experience" value={form.experience} onChange={onChange}>
                  <option>Entry-level</option>
                  <option>Mid-level</option>
                  <option>Senior-level</option>
                </select>
              </label>
              <Input label="Application deadline" name="deadline" value={form.deadline} onChange={onChange} placeholder="30 Sep 2026" />
            </div>
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea
                className="ui-input"
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                placeholder="Role summary and requirements"
              />
            </label>
          </div>
          <Button type="submit" variant="primary">Post job →</Button>
        </form>
      </div>
    </div>
  )
}
