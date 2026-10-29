import { Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext.jsx'

export default function Overview() {
  const { analytics, users, loading } = useAdmin()
  if (loading || !analytics) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const pendingUsers = users.filter((u) => u.status === 'PendingApproval').length

  const stats = [
    { label: 'Live jobs & internships', value: analytics.jobCount, to: '/admin/jobs' },
    { label: 'Approved events', value: analytics.eventCount, to: '/admin/events' },
    { label: 'Showcased projects', value: analytics.projectCount, to: '/admin/analytics' },
    { label: 'Active mentors', value: analytics.mentorCount, to: '/admin/analytics' },
    { label: 'Mentor bookings', value: analytics.bookingCount, to: '/admin/analytics' },
  ]

  return (
    <div>
      <div className="dash-head">
        <h1>Admin dashboard.</h1>
        <p>Real counts pulled from the database.</p>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <Link to={s.to} className="stat" key={s.label} style={{ display: 'block' }}>
            <b>{s.value}</b>
            <span>{s.label.toUpperCase()}</span>
          </Link>
        ))}
      </div>
      <div className="quick-grid" style={{ marginTop: 24 }}>
        <Link to="/admin/users" className="quick-link">
          <span className="label">Users</span>
          <span className={`status ${pendingUsers ? '' : 'done'}`}>{pendingUsers ? `${pendingUsers} pending approval` : 'All reviewed'}</span>
        </Link>
        <Link to="/admin/companies" className="quick-link"><span className="label">Companies</span><span className="status">Verify</span></Link>
        <Link to="/admin/reports" className="quick-link"><span className="label">Reports</span><span className="status">Review</span></Link>
        <Link to="/admin/verification" className="quick-link"><span className="label">Verification queue</span><span className="status">Review</span></Link>
        <Link to="/admin/messages" className="quick-link"><span className="label">Messages</span><span className="status">Inbox</span></Link>
      </div>
    </div>
  )
}
