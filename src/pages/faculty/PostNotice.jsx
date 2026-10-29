import { useState } from 'react'
import { useFaculty } from '../../context/FacultyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', content: '' }

export default function PostNotice() {
  const { notices, refreshNotices } = useFaculty()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/faculty/me/notices', form)
    setForm(EMPTY)
    refreshNotices()
  }

  const onRemove = async (id) => {
    await api.delete(`/faculty/me/notices/${id}`)
    refreshNotices()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Post a notice</h1>
        <p>Department-wide announcements shown on the student feed.</p>
      </div>

      {notices.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No notices posted yet.</p>
      )}

      {notices.map((n) => (
        <div className="entry-card" key={n._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{n.title}</div>
              <div className="entry-meta">{new Date(n.createdAt).toLocaleDateString()}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(n._id)} aria-label="Remove notice">✕</button>
          </div>
          <p className="entry-desc">{n.content}</p>
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">New notice</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Mid-term exam schedule released" />
            <label className="ui-field">
              <span className="ui-label">Content</span>
              <textarea className="ui-input" name="content" value={form.content} onChange={onChange} rows={4} placeholder="Notice details" />
            </label>
          </div>
          <Button type="submit" variant="primary">Post notice →</Button>
        </form>
      </div>
    </div>
  )
}
