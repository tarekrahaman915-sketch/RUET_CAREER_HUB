import { useState } from 'react'
import { useFaculty } from '../../context/FacultyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', company: '', description: '', deadline: '' }

export default function RecommendInternship() {
  const { recommendedInternships, refreshRecommendedInternships } = useFaculty()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/faculty/me/recommended-internships', form)
    setForm(EMPTY)
    refreshRecommendedInternships()
  }

  const onRemove = async (id) => {
    await api.delete(`/faculty/me/recommended-internships/${id}`)
    refreshRecommendedInternships()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Recommend an internship</h1>
        <p>Surface internships you trust — through industry contacts or past collaborations.</p>
      </div>

      {recommendedInternships.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No internships recommended yet.</p>
      )}

      {recommendedInternships.map((op) => (
        <div className="entry-card" key={op._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{op.title}</div>
              <div className="entry-meta">{[op.company, op.deadline && `Deadline: ${op.deadline}`].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(op._id)} aria-label="Remove internship">✕</button>
          </div>
          {op.description && <p className="entry-desc">{op.description}</p>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New recommendation</div>
        <form onSubmit={onSubmit}>
          <div className="form-grid form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Signal Processing Intern" />
            <Input label="Company" name="company" value={form.company} onChange={onChange} placeholder="Farfield Aerospace" />
          </div>
          <div className="form-row">
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea className="ui-input" name="description" value={form.description} onChange={onChange} rows={3} placeholder="Why you're recommending this internship" />
            </label>
            <Input label="Deadline" name="deadline" value={form.deadline} onChange={onChange} placeholder="1 Dec 2026" />
          </div>
          <Button type="submit" variant="primary">Add recommendation →</Button>
        </form>
      </div>
    </div>
  )
}
