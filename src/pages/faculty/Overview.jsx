import { Link } from 'react-router-dom'
import { useFaculty } from '../../context/FacultyContext.jsx'

export default function Overview() {
  const { events, notices, researchOpportunities, recommendedInternships, loading } = useFaculty()
  if (loading) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const pendingEvents = events.filter((e) => e.status === 'Pending').length

  const items = [
    { label: 'Approve events', done: pendingEvents === 0 && events.length > 0, to: '/faculty/events', note: pendingEvents ? `${pendingEvents} pending` : null },
    { label: 'Recommend students', to: '/faculty/recommend-students' },
    { label: 'Post notice', done: notices.length > 0, to: '/faculty/notices' },
    { label: 'Research opportunities', done: researchOpportunities.length > 0, to: '/faculty/research' },
    { label: 'Recommend internship', done: recommendedInternships.length > 0, to: '/faculty/recommend-internship' },
  ]

  return (
    <div>
      <div className="dash-head">
        <h1>Faculty overview.</h1>
        <p>Keep events, notices, and research opportunities up to date.</p>
      </div>

      <div className="quick-grid">
        {items.map((item) => (
          <Link to={item.to} className="quick-link" key={item.label}>
            <span className="label">{item.label}</span>
            <span className={`status ${item.done ? 'done' : ''}`}>
              {item.note || (item.done ? '✓ Up to date' : 'Nothing yet')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
