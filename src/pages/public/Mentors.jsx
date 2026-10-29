import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import MessageModal from '../../components/ui/MessageModal.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Input from '../../components/ui/Input.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { REAL_FACULTY } from '../../data/realPeople.js'
import { DEPARTMENTS } from '../../utils/departments.js'

const STARTERS = [
  'Hi! I am a RUET student and would love your advice on getting started in your field. Could you spare 15 minutes?',
  'Could you review my CV and tell me what to improve for roles like yours?',
  'I am applying for a masters abroad. Could you share how you approached your SOP and supervisor emails?',
]

// Real RUET faculty with a published research profile act as faculty advisors.
const ADVISORS = REAL_FACULTY.filter((f) => f.hasFullDetails)

export default function Mentors() {
  const { user, isSignedIn } = useAuth()
  const [mentors, setMentors] = useState(null)
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [messageTo, setMessageTo] = useState(null)
  const [booking, setBooking] = useState(null)
  const [slot, setSlot] = useState({ date: '', time: '' })
  const [bookMsg, setBookMsg] = useState('')

  useEffect(() => {
    api.get('/mentors').then((d) => setMentors(d.mentors)).catch(() => setMentors([]))
  }, [])

  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return (mentors || []).filter((m) => (dept === 'All' || m.department === dept) && (!n || `${m.name} ${m.company} ${m.position} ${m.bio} ${(m.expertise || []).join(' ')}`.toLowerCase().includes(n)))
  }, [mentors, q, dept])

  const asPerson = (m) => ({ _id: m.alumni, name: m.name, role: 'Alumni', department: m.department, profilePicture: m.profilePicture })

  const book = async (e) => {
    e.preventDefault()
    setBookMsg('')
    try {
      await api.post(`/mentors/${booking._id}/book`, slot)
      setBookMsg('Request sent. You will be notified when the mentor confirms.')
    } catch (err) {
      setBookMsg(err.message)
    }
  }

  return (
    <main className="page">
      <div className="wrap">
        <h1>Mentors</h1>
        <p className="lead">Guidance from RUET faculty advisors and from alumni who volunteer as mentors. Alumni appear here only after they sign up and switch mentoring on, so every mentor is a real person who agreed to be listed.</p>

        <div className="mentor-how">
          <div><b>1</b><span>Pick a mentor in your field</span></div>
          <div><b>2</b><span>Send a short, specific message</span></div>
          <div><b>3</b><span>Continue in your inbox or book a call</span></div>
        </div>

        <h2 style={{ fontSize: 20, marginTop: 36 }}>Alumni mentors</h2>
        {user?.role === 'Alumni' && <p className="people-signin-hint">Want to appear here? <Link to="/alumni/mentorship">Turn on mentoring in your alumni dashboard</Link>.</p>}
        <div className="people-filters">
          <input className="ui-input" placeholder="Search alumni by name, company or topic (e.g. DAAD, backend)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search mentors" />
          <select className="ui-input" value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department">
            <option value="All">All departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        {mentors === null && <p className="board-empty">Loading…</p>}
        {mentors !== null && mentors.length === 0 && (
          <div className="claim-banner" style={{ marginTop: 16 }}>
            No alumni have opted in as mentors yet. Alumni: create a profile, then enable mentoring in your dashboard. Meanwhile, browse the official <a href="https://alumni.ruet.ac.bd/" target="_blank" rel="noreferrer">RUET alumni portal ↗</a> or message a faculty advisor below.
          </div>
        )}
        <div className="page-grid">
          {list.map((m) => (
            <div className="ui-card" key={m._id}>
              <Link to={`/people/${m.alumni}`} className="person-head">
                <Avatar person={m} size={60} />
                <div style={{ minWidth: 0 }}>
                  <div className="ui-card-title">{m.name}</div>
                  <p className="person-sub">{[m.position, m.company].filter(Boolean).join(' · ')}</p>
                  {m.department && <p className="person-sub" style={{ color: 'var(--text-faint)' }}>{m.department}</p>}
                </div>
              </Link>
              {m.bio && <p className="entry-desc" style={{ margin: 0 }}>{m.bio}</p>}
              {m.expertise?.length > 0 && <div className="entry-tags">{m.expertise.map((e) => <span className="tag tag-teal" key={e}>{e}</span>)}</div>}
              <div className="contact-row">
                <Button variant="primary" onClick={() => setMessageTo(asPerson(m))}>Message</Button>
                {user?.role === 'Student' && <Button variant="secondary" onClick={() => { setBooking(m); setSlot({ date: '', time: '' }); setBookMsg('') }}>Book session</Button>}
                <Link className="btn btn-ghost btn-sm" to={`/people/${m.alumni}`} style={{ marginLeft: 'auto' }}>Profile →</Link>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 20, marginTop: 44 }}>Faculty advisors (Dept. of ETE)</h2>
        <p className="lead" style={{ marginTop: 6 }}>Real faculty from the official department site who list their research areas. Email them with a specific question about thesis topics, research or higher studies.</p>
        <div className="page-grid">
          {ADVISORS.map((f) => (
            <div className="ui-card" key={f._id}>
              <Link to={`/people/${f._id}`} className="person-head">
                <Avatar person={f} size={60} />
                <div style={{ minWidth: 0 }}><div className="ui-card-title">{f.name}</div><p className="person-sub">{f.designation} · ETE, RUET</p></div>
              </Link>
              <p className="entry-desc" style={{ margin: 0 }}>{f.headline}</p>
              <div className="entry-tags">{f.researchAreas.slice(0, 4).map((a) => <span className="tag tag-teal" key={a}>{a}</span>)}</div>
              <div className="contact-row">
                {isSignedIn ? <a className="btn btn-primary btn-sm" href={`mailto:${f.email}`}>Email</a> : <Link className="contact-note" to="/login">Sign in to see email</Link>}
                <a className="btn btn-secondary btn-sm" href={f.officialProfile} target="_blank" rel="noreferrer">Official profile ↗</a>
                <Link className="btn btn-ghost btn-sm" to={`/people/${f._id}`} style={{ marginLeft: 'auto' }}>Profile →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MessageModal person={messageTo} isOpen={Boolean(messageTo)} onClose={() => setMessageTo(null)} presets={STARTERS} />
      <Modal isOpen={Boolean(booking)} onClose={() => setBooking(null)} title={`Book a session: ${booking?.name ?? ''}`}>
        <form onSubmit={book}>
          <div className="form-row"><div className="form-grid">
            <Input label="Date" value={slot.date} onChange={(e) => setSlot({ ...slot, date: e.target.value })} placeholder="12 Nov 2026" />
            <Input label="Time" value={slot.time} onChange={(e) => setSlot({ ...slot, time: e.target.value })} placeholder="4:00 PM" />
          </div></div>
          {bookMsg && <p style={{ fontSize: 13, marginBottom: 10, color: bookMsg.startsWith('Request') ? 'var(--success)' : 'var(--danger)' }}>{bookMsg}</p>}
          <Button type="submit" variant="primary" block>Request session →</Button>
        </form>
      </Modal>
    </main>
  )
}
