import { useState } from 'react'
import { useAlumni } from '../../context/AlumniContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', content: '' }

export default function SuccessStory() {
  const { successStories, refreshSuccessStories } = useAlumni()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/alumni/me/success-stories', form)
    setForm(EMPTY)
    refreshSuccessStories()
  }

  const onRemove = async (id) => {
    await api.delete(`/alumni/me/success-stories/${id}`)
    refreshSuccessStories()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Share your success story</h1>
        <p>Your journey since graduating — shown to current students for inspiration.</p>
      </div>

      {successStories.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No stories shared yet.</p>
      )}

      {successStories.map((s) => (
        <div className="entry-card" key={s._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{s.title}</div>
              <div className="entry-meta">{new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(s._id)} aria-label="Remove story">✕</button>
          </div>
          <p className="entry-desc">{s.content}</p>
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New success story</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="From campus to Orbit Telecom" />
            <label className="ui-field">
              <span className="ui-label">Your story</span>
              <textarea
                className="ui-input"
                name="content"
                value={form.content}
                onChange={onChange}
                rows={4}
                placeholder="What your path looked like, and what you'd tell your younger self"
              />
            </label>
          </div>
          <Button type="submit" variant="primary">Share story →</Button>
        </form>
      </div>
    </div>
  )
}
