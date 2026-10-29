import { useAdmin } from '../../context/AdminContext.jsx'

export default function Analytics() {
  const { analytics, loading } = useAdmin()
  if (loading || !analytics) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  return (
    <div>
      <div className="dash-head">
        <h1>Analytics</h1>
        <p>Real counts from the database.</p>
      </div>

      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-title">Postings by category</div>
        <div className="entry-tags" style={{ marginTop: 10 }}>
          {analytics.jobsByCategory.map((c) => (
            <span className="chip" key={c._id}>{c._id}: {c.count}</span>
          ))}
          {analytics.jobsByCategory.length === 0 && <span className="chip">No postings yet</span>}
        </div>
      </div>

      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-title">Users by role</div>
        <div className="entry-tags" style={{ marginTop: 10 }}>
          {analytics.userCounts.map((c) => (
            <span className="chip" key={c._id}>{c._id}: {c.count}</span>
          ))}
        </div>
      </div>

      <div className="stats" style={{ marginBottom: 20 }}>
        <div className="stat"><b>{analytics.eventCount}</b><span>APPROVED EVENTS</span></div>
        <div className="stat"><b>{analytics.projectCount}</b><span>SHOWCASED PROJECTS</span></div>
        <div className="stat"><b>{analytics.mentorCount}</b><span>ACTIVE MENTORS</span></div>
        <div className="stat"><b>{analytics.jobCount}</b><span>LIVE POSTINGS</span></div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-faint)' }}>
        Department-wide figures like placement rate and average salary need more historical data than exists yet
        — the homepage Statistics section still shows illustrative sample figures for those.
      </p>
    </div>
  )
}
