import { useState } from 'react'
import { useFaculty } from '../../context/FacultyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { studentName: '', recommendedFor: '', reason: '' }

export default function RecommendStudents() {
  const { recommendedStudents, refreshRecommendedStudents } = useFaculty()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentName.trim()) return
    await api.post('/faculty/me/recommended-students', form)
    setForm(EMPTY)
    refreshRecommendedStudents()
  }

  const onRemove = async (id) => {
    await api.delete(`/faculty/me/recommended-students/${id}`)
    refreshRecommendedStudents()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Recommend students</h1>
        <p>Vouch for students applying to jobs, internships, or research positions.</p>
      </div>

      {recommendedStudents.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No recommendations yet.</p>
      )}

      {recommendedStudents.map((r) => (
        <div className="entry-card" key={r._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{r.studentName}</div>
              <div className="entry-meta">Recommended for: {r.recommendedFor}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(r._id)} aria-label="Remove recommendation">✕</button>
          </div>
          {r.reason && <p className="entry-desc">{r.reason}</p>}
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New recommendation</div>
        <form onSubmit={onSubmit}>
          <div className="form-grid form-row">
            <Input label="Student name" name="studentName" value={form.studentName} onChange={onChange} placeholder="Nusrat Jahan" />
            <Input label="Recommended for" name="recommendedFor" value={form.recommendedFor} onChange={onChange} placeholder="Research internship at Circuitry Labs" />
          </div>
          <div className="form-row">
            <label className="ui-field">
              <span className="ui-label">Reason</span>
              <textarea className="ui-input" name="reason" value={form.reason} onChange={onChange} rows={3} placeholder="Why you're recommending them" />
            </label>
          </div>
          <Button type="submit" variant="primary">Add recommendation →</Button>
        </form>
      </div>
    </div>
  )
}
