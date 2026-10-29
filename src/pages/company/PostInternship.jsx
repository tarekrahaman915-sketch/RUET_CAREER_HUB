import { useState } from 'react'
import { useCompany } from '../../context/CompanyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', location: '', duration: '', internshipType: 'Summer Internship', deadline: '', description: '' }

export default function PostInternship() {
  const { internships, refreshInternships } = useCompany()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/jobs', { ...form, category: 'Internship', type: 'Internship' })
    setForm(EMPTY)
    refreshInternships()
  }

  const onRemove = async (id) => {
    await api.delete(`/jobs/${id}`)
    refreshInternships()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Post an internship</h1>
        <p>Reach students looking for summer, industrial, or research internships.</p>
      </div>

      {internships.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No internships posted yet.</p>
      )}

      {internships.map((i) => (
        <div className="entry-card" key={i._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{i.title}</div>
              <div className="entry-meta">{[i.internshipType, i.duration, i.location].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(i._id)} aria-label="Remove internship">✕</button>
          </div>
          {i.description && <p className="entry-desc">{i.description}</p>}
          {i.deadline && <div className="entry-meta">Deadline: {i.deadline}</div>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New internship posting</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-grid">
              <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="RF Design Intern" />
              <Input label="Location" name="location" value={form.location} onChange={onChange} placeholder="Remote / On-site" />
            </div>
            <div className="form-grid">
              <Input label="Duration" name="duration" value={form.duration} onChange={onChange} placeholder="3 months" />
              <label className="ui-field">
                <span className="ui-label">Internship type</span>
                <select className="ui-input" name="internshipType" value={form.internshipType} onChange={onChange}>
                  <option>Summer Internship</option>
                  <option>Industrial Training</option>
                  <option>Research Internship</option>
                  <option>Remote Internship</option>
                </select>
              </label>
            </div>
            <Input label="Application deadline" name="deadline" value={form.deadline} onChange={onChange} placeholder="15 Aug 2026" />
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea
                className="ui-input"
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                placeholder="What the intern will work on"
              />
            </label>
          </div>
          <Button type="submit" variant="primary">Post internship →</Button>
        </form>
      </div>
    </div>
  )
}
