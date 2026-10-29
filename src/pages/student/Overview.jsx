import { Link } from 'react-router-dom'
import { useStudent } from '../../context/StudentContext.jsx'

export default function Overview() {
  const { user, projects, completeness, loading } = useStudent()
  if (loading || !user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const sp = user.studentProfile || {}
  const items = [
    { label: 'Profile details', done: Boolean(user.name && user.department && sp.studentId), to: '/student/profile' },
    { label: 'Skills & languages', done: sp.skills?.length > 0 && sp.languages?.length > 0, to: '/student/skills' },
    { label: 'CV, transcript & photo', done: Boolean(sp.documents?.cv && sp.documents?.transcript), to: '/student/documents' },
    { label: 'Projects', done: projects.length > 0, to: '/student/projects' },
    { label: 'Certifications', done: sp.certifications?.length > 0, to: '/student/certifications' },
    { label: 'Portfolio & links', done: Boolean(sp.portfolio?.github || sp.portfolio?.linkedin || sp.portfolio?.website), to: '/student/portfolio' },
  ]

  return (
    <div>
      <div className="dash-head">
        <h1>Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
        <p>Here's where your career profile stands right now.</p>
      </div>

      <div className="ui-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="ui-card-title">Profile completeness</span>
          <span className="mono" style={{ color: 'var(--signal)', fontSize: 13 }}>{completeness}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completeness}%` }} />
        </div>
      </div>

      <div className="quick-grid">
        {items.map((item) => (
          <Link to={item.to} className="quick-link" key={item.label}>
            <span className="label">{item.label}</span>
            <span className={`status ${item.done ? 'done' : ''}`}>{item.done ? '✓ Complete' : 'Incomplete'}</span>
          </Link>
        ))}
        <Link to="/student/department" className="quick-link">
          <span className="label">My department</span>
          <span className="status">{user.department || 'Not set'}</span>
        </Link>
      </div>
    </div>
  )
}
