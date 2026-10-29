import { Link } from 'react-router-dom'
import { useAlumni } from '../../context/AlumniContext.jsx'

export default function Overview() {
  const { user, careerTips, successStories, loading } = useAlumni()
  if (loading || !user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const ap = user.alumniProfile || {}
  const items = [
    { label: 'Job position', done: Boolean(ap.jobPosition?.position && ap.jobPosition?.company), to: '/alumni/job-position' },
    { label: 'Postings', to: '/alumni/postings' },
    { label: 'Mentorship', done: ap.mentor?.isMentor, to: '/alumni/mentorship' },
    { label: 'Career tips', done: careerTips.length > 0, to: '/alumni/career-tips' },
    { label: 'Success story', done: successStories.length > 0, to: '/alumni/success-story' },
  ]

  return (
    <div>
      <div className="dash-head">
        <h1>Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
        <p>Thanks for staying connected to the board.</p>
      </div>

      <div className="quick-grid">
        {items.map((item) => (
          <Link to={item.to} className="quick-link" key={item.label}>
            <span className="label">{item.label}</span>
            <span className={`status ${item.done ? 'done' : ''}`}>{item.done ? '✓ Complete' : 'Not started'}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
