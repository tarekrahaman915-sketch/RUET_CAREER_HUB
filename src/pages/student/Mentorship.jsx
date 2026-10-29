import { useEffect, useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'
import Avatar from '../../components/ui/Avatar.jsx'
import MessageModal from '../../components/ui/MessageModal.jsx'

export default function Mentorship() {
  const { mentorBookings, refreshMentorBookings } = useStudent()
  const [mentors, setMentors] = useState([])
  const [modalFor, setModalFor] = useState(null)
  const [messageTo, setMessageTo] = useState(null)
  const [form, setForm] = useState({ date: '', time: '' })
  const [feedbackDraftId, setFeedbackDraftId] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    api.get('/mentors').then((data) => setMentors(data.mentors))
  }, [])

  const openBooking = (mentor) => {
    setModalFor(mentor)
    setForm({ date: '', time: '' })
  }

  const submitBooking = async (e) => {
    e.preventDefault()
    await api.post(`/mentors/${modalFor._id}/book`, form)
    setModalFor(null)
    refreshMentorBookings()
  }

  const submitFeedback = async (bookingId) => {
    await api.patch(`/mentors/bookings/${bookingId}/feedback`, { feedback: feedbackText })
    setFeedbackDraftId(null)
    setFeedbackText('')
    refreshMentorBookings()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Mentorship</h1>
        <p>Book time with alumni mentors and keep track of your sessions.</p>
      </div>

      <div className="dash-head" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18 }}>Available mentors</h1>
      </div>

      {mentors.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 24 }}>
          No mentors are listed yet — check back once an alumnus opts in.
        </p>
      )}

      <div className="page-grid" style={{ marginTop: 0, marginBottom: 32 }}>
        {mentors.map((m) => (
          <div className="ui-card" key={m._id}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar person={m} size={48} />
              <div>
                <div className="ui-card-title">{m.name}</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: 0 }}>
                  {[m.position, m.company].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
            {m.bio && <p className="entry-desc">{m.bio}</p>}
            {m.expertise?.length > 0 && (
              <div className="entry-tags">
                {m.expertise.map((e) => (
                  <span className="chip" key={e}>{e}</span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => setMessageTo({ _id: m.alumni, name: m.name, role: 'Alumni', department: m.department, profilePicture: m.profilePicture })}>Message</Button>
              <Button variant="secondary" onClick={() => openBooking(m)}>Book session</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-head" style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 18 }}>Your bookings</h1>
      </div>

      {mentorBookings.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No sessions booked yet.</p>
      )}

      {mentorBookings.map((b) => (
        <div className="entry-card" key={b._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{b.mentorName}</div>
              <div className="entry-meta">{b.date} · {b.time}</div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: b.status === 'Confirmed' ? 'var(--signal)' : 'var(--text-faint)' }}>
              ● {b.status}
            </span>
          </div>
          {b.meetLink && (
            <div className="entry-links">
              <a href={b.meetLink} target="_blank" rel="noreferrer">Join meeting ↗</a>
            </div>
          )}
          {b.feedback ? (
            <p className="entry-desc">Your feedback: {b.feedback}</p>
          ) : feedbackDraftId === b._id ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="ui-input"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="How was the session?"
              />
              <Button variant="primary" onClick={() => submitFeedback(b._id)}>Submit</Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setFeedbackDraftId(b._id)}>Leave feedback</Button>
          )}
        </div>
      ))}

      <MessageModal person={messageTo} isOpen={Boolean(messageTo)} onClose={() => setMessageTo(null)} />

      <Modal isOpen={Boolean(modalFor)} onClose={() => setModalFor(null)} title={`Book a session — ${modalFor?.name ?? ''}`}>
        <form onSubmit={submitBooking}>
          <div className="form-row">
            <div className="form-grid">
              <Input
                label="Date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="12 Aug 2026"
              />
              <Input
                label="Time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="4:00 PM"
              />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 14 }}>
            Your mentor will confirm and share a Google Meet link once accepted.
          </p>
          <Button type="submit" variant="primary" block>Request session →</Button>
        </form>
      </Modal>
    </div>
  )
}
