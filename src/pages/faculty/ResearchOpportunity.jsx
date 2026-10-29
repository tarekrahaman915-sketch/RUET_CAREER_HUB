import { useState } from 'react'
import { useFaculty } from '../../context/FacultyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', description: '', deadline: '' }

export default function ResearchOpportunity() {
  const { researchOpportunities, refreshResearchOpportunities } = useFaculty()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/faculty/me/research-opportunities', form)
    setForm(EMPTY)
    refreshResearchOpportunities()
  }

  const onRemove = async (id) => {
    await api.delete(`/faculty/me/research-opportunities/${id}`)
    refreshResearchOpportunities()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Post a research opportunity</h1>
        <p>Open positions in your lab or research group for interested students.</p>
      </div>

      {researchOpportunities.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No opportunities posted yet.</p>
      )}

      {researchOpportunities.map((op) => (
        <div className="entry-card" key={op._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{op.title}</div>
              {op.deadline && <div className="entry-meta">Deadline: {op.deadline}</div>}
            </div>
            <button className="entry-remove" onClick={() => onRemove(op._id)} aria-label="Remove opportunity">✕</button>
          </div>
          {op.description && <p className="entry-desc">{op.description}</p>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New research opportunity</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Undergraduate Research Assistant — RF Antenna Design" />
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea className="ui-input" name="description" value={form.description} onChange={onChange} rows={3} placeholder="Scope of the work and requirements" />
            </label>
            <Input label="Deadline" name="deadline" value={form.deadline} onChange={onChange} placeholder="15 Nov 2026" />
          </div>
          <Button type="submit" variant="primary">Post opportunity →</Button>
        </form>
      </div>
    </div>
  )
}
