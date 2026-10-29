import { useState } from 'react'
import { useAlumni } from '../../context/AlumniContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', content: '' }

export default function CareerTips() {
  const { careerTips, refreshCareerTips } = useAlumni()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/alumni/me/career-tips', form)
    setForm(EMPTY)
    refreshCareerTips()
  }

  const onRemove = async (id) => {
    await api.delete(`/alumni/me/career-tips/${id}`)
    refreshCareerTips()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Post a career tip</h1>
        <p>Short, practical advice shows up on the department feed for students.</p>
      </div>

      {careerTips.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No tips posted yet.</p>
      )}

      {careerTips.map((t) => (
        <div className="entry-card" key={t._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{t.title}</div>
              <div className="entry-meta">{new Date(t.createdAt).toLocaleDateString()}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(t._id)} aria-label="Remove tip">✕</button>
          </div>
          <p className="entry-desc">{t.content}</p>
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New career tip</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="How I prepared for my first technical interview" />
            <label className="ui-field">
              <span className="ui-label">Content</span>
              <textarea
                className="ui-input"
                name="content"
                value={form.content}
                onChange={onChange}
                rows={4}
                placeholder="Share your advice"
              />
            </label>
          </div>
          <Button type="submit" variant="primary">Post tip →</Button>
        </form>
      </div>
    </div>
  )
}
