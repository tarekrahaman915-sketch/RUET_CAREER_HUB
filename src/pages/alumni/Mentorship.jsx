import { useEffect, useState } from 'react'
import { useAlumni } from '../../context/AlumniContext.jsx'
import TagInput from '../../components/ui/TagInput.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

export default function Mentorship() {
  const { user, setUser } = useAlumni()
  const [bio, setBio] = useState('')
  const [expertise, setExpertise] = useState([])
  const [saved, setSaved] = useState(false)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (user) {
      setBio(user.alumniProfile?.mentor?.bio || '')
      setExpertise(user.alumniProfile?.mentor?.expertise || [])
    }
  }, [user])

  const loadBookings = () => api.get('/mentors/me/bookings').then((data) => setBookings(data.bookings))

  useEffect(() => {
    if (user?.alumniProfile?.mentor?.isMentor) loadBookings()
  }, [user?.alumniProfile?.mentor?.isMentor])

  const toggleMentor = async () => {
    const res = await api.patch('/alumni/me/mentor', { isMentor: !user.alumniProfile.mentor.isMentor })
    setUser(res.user)
  }

  const onSave = async () => {
    const res = await api.patch('/alumni/me/mentor', { bio, expertise })
    setUser(res.user)
    setSaved(true)
  }

  const confirmBooking = async (id) => {
    await api.patch(`/mentors/bookings/${id}/confirm`)
    loadBookings()
  }

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>
  const isMentor = user.alumniProfile?.mentor?.isMentor

  return (
    <div>
      <div className="dash-head">
        <h1>Mentorship</h1>
        <p>Students can book time with you once you're listed as a mentor.</p>
      </div>

      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="ui-card-title">Mentor status</div>
            <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: '4px 0 0' }}>
              {isMentor ? 'You are listed as an available mentor.' : "You're not listed as a mentor yet."}
            </p>
          </div>
          <Button variant={isMentor ? 'ghost' : 'primary'} onClick={toggleMentor}>
            {isMentor ? 'Stop mentoring' : 'Become a mentor →'}
          </Button>
        </div>
      </div>

      {isMentor && (
        <>
          <div className="form-row">
            <label className="ui-field">
              <span className="ui-label">Mentor bio</span>
              <textarea
                className="ui-input"
                value={bio}
                onChange={(e) => { setBio(e.target.value); setSaved(false) }}
                rows={3}
                placeholder="What you can help students with, and how you like to mentor"
              />
            </label>
            <TagInput
              label="Areas of expertise"
              value={expertise}
              onChange={(v) => { setExpertise(v); setSaved(false) }}
              placeholder="e.g. RF Engineering, Career switching — press Enter"
            />
            <div>
              <Button variant="primary" onClick={onSave}>Save mentor profile →</Button>
              {saved && <span className="mono" style={{ marginLeft: 14, color: 'var(--signal)', fontSize: 13 }}>Saved ✓</span>}
            </div>
          </div>

          <div className="dash-head" style={{ marginTop: 36 }}>
            <h1 style={{ fontSize: 20 }}>Session requests</h1>
            <p>Students who've booked time with you.</p>
          </div>

          {bookings.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No session requests yet.</p>}

          {bookings.map((b) => (
            <div className="entry-card" key={b._id}>
              <div className="entry-head">
                <div>
                  <div className="entry-title">{b.studentName}</div>
                  <div className="entry-meta">{b.date} · {b.time}</div>
                </div>
                <span className="mono" style={{ fontSize: 12, color: b.status === 'Confirmed' ? 'var(--signal)' : 'var(--text-faint)' }}>
                  ● {b.status}
                </span>
              </div>
              {b.status === 'Confirmed' && b.meetLink && (
                <div className="entry-links">
                  <a href={b.meetLink} target="_blank" rel="noreferrer">Join meeting ↗</a>
                </div>
              )}
              {b.feedback && <p className="entry-desc">Feedback: {b.feedback}</p>}
              {b.status !== 'Confirmed' && (
                <Button variant="ghost" onClick={() => confirmBooking(b._id)}>Confirm & generate meeting link</Button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
