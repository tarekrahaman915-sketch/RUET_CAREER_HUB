import { useState } from 'react'
import { useFaculty } from '../../context/FacultyContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', organizer: '', type: 'Seminar', date: '', venue: '', description: '' }

const STATUS_COLOR = {
  Pending: 'var(--text-faint)',
  Approved: 'var(--success)',
  Rejected: 'var(--danger)',
}

export default function ApproveEvents() {
  const { events, refreshEvents } = useFaculty()
  const [form, setForm] = useState(EMPTY)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/faculty/me/events', form)
    setForm(EMPTY)
    refreshEvents()
  }

  const setStatus = async (id, status) => {
    await api.patch(`/faculty/me/events/${id}/status`, { status })
    refreshEvents()
  }

  const onRemove = async (id) => {
    await api.delete(`/faculty/me/events/${id}`)
    refreshEvents()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Approve events</h1>
        <p>Review event submissions before they go live on the public Events page.</p>
      </div>

      {events.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No events submitted yet.</p>
      )}

      {events.map((ev) => (
        <div className="entry-card" key={ev._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{ev.title}</div>
              <div className="entry-meta">{[ev.type, ev.organizer, ev.date, ev.venue].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => onRemove(ev._id)} aria-label="Remove event">✕</button>
          </div>
          {ev.description && <p className="entry-desc">{ev.description}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="mono" style={{ fontSize: 12, color: STATUS_COLOR[ev.status] }}>● {ev.status}</span>
            {ev.status !== 'Approved' && <Button variant="ghost" onClick={() => setStatus(ev._id, 'Approved')}>Approve</Button>}
            {ev.status !== 'Rejected' && <Button variant="ghost" onClick={() => setStatus(ev._id, 'Rejected')}>Reject</Button>}
          </div>
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">Submit an event for review</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-grid">
              <Input label="Event title" name="title" value={form.title} onChange={onChange} placeholder="Annual Tech Fest" />
              <Input label="Organizer" name="organizer" value={form.organizer} onChange={onChange} placeholder="RUET Student Council" />
            </div>
            <div className="form-grid">
              <label className="ui-field">
                <span className="ui-label">Type</span>
                <select className="ui-input" name="type" value={form.type} onChange={onChange}>
                  <option>Seminar</option>
                  <option>Workshop</option>
                  <option>Hackathon</option>
                  <option>Job Fair</option>
                  <option>Career Fair</option>
                </select>
              </label>
              <Input label="Date" name="date" value={form.date} onChange={onChange} placeholder="12 Oct 2026" />
            </div>
            <div className="form-grid">
              <Input label="Venue" name="venue" value={form.venue} onChange={onChange} placeholder="Auditorium / Online" />
            </div>
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea className="ui-input" name="description" value={form.description} onChange={onChange} rows={3} placeholder="What this event is about" />
            </label>
          </div>
          <Button type="submit" variant="primary">Submit →</Button>
        </form>
      </div>
    </div>
  )
}
