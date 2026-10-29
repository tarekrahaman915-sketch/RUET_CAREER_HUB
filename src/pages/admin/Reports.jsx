import { useAdmin } from '../../context/AdminContext.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Reports() {
  const { reports, resolveReport } = useAdmin()
  return (
    <div>
      <div className="dash-head">
        <h1>Reports</h1>
        <p>Flagged-content queue.</p>
      </div>
      {reports.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No reports.</p>}
      {reports.map((r) => (
        <div className="entry-card" key={r._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{r.subject}</div>
              <div className="entry-meta">{r.category}</div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: r.status === 'Resolved' ? 'var(--success)' : 'var(--danger)' }}>
              ● {r.status}
            </span>
          </div>
          {r.status !== 'Resolved' && <Button variant="ghost" onClick={() => resolveReport(r._id)}>Mark resolved</Button>}
        </div>
      ))}
    </div>
  )
}
