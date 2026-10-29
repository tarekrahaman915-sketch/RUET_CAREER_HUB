import { useEffect, useState } from 'react'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { type: 'Job', title: '', company: '', location: '', deadline: '', description: '' }

export default function Postings() {
  const [postings, setPostings] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)

  const load = () => api.get('/alumni/me/postings').then((data) => { setPostings(data.postings); setLoading(false) })
  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/jobs', { ...form, category: form.type })
    setForm(EMPTY)
    load()
  }

  const onRemove = async (id) => {
    await api.delete(`/jobs/${id}`)
    load()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Offer a job or internship</h1>
        <p>Give back by opening a role at your company to RUET students.</p>
      </div>

      {!loading && postings.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No postings yet.</p>
      )}

      {postings.map((p) => (
        <div className="entry-card" key={p._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{p.title}</div>
              <div className="entry-meta">{[p.category, p.company, p.location].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(p._id)} aria-label="Remove posting">✕</button>
          </div>
          {p.description && <p className="entry-desc">{p.description}</p>}
          {p.deadline && <div className="entry-meta">Deadline: {p.deadline}</div>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New posting</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label className="ui-field">
              <span className="ui-label">Type</span>
              <select className="ui-input" name="type" value={form.type} onChange={onChange}>
                <option>Job</option>
                <option>Internship</option>
              </select>
            </label>
            <div className="form-grid">
              <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Firmware Engineer" />
              <Input label="Company" name="company" value={form.company} onChange={onChange} placeholder="Your company" />
            </div>
            <div className="form-grid">
              <Input label="Location" name="location" value={form.location} onChange={onChange} placeholder="Remote / Dhaka" />
              <Input label="Deadline" name="deadline" value={form.deadline} onChange={onChange} placeholder="30 Sep 2026" />
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
          <Button type="submit" variant="primary">Post →</Button>
        </form>
      </div>
    </div>
  )
}
