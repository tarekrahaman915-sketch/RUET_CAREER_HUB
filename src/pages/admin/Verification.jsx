import { useAdmin } from '../../context/AdminContext.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Verification() {
  const { verificationRequests, setVerificationStatus } = useAdmin()
  return (
    <div>
      <div className="dash-head">
        <h1>Verification queue</h1>
        <p>Illustrative pending verification requests (separate from account approval on the Users page).</p>
      </div>
      {verificationRequests.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>Nothing pending.</p>}
      {verificationRequests.map((v) => (
        <div className="entry-card" key={v._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{v.name}</div>
              <div className="entry-meta">{v.role}</div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: v.status === 'Approved' ? 'var(--signal)' : 'var(--text-faint)' }}>
              ● {v.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {v.status !== 'Approved' && <Button variant="ghost" onClick={() => setVerificationStatus(v._id, 'Approved')}>Approve</Button>}
            {v.status !== 'Rejected' && <Button variant="ghost" onClick={() => setVerificationStatus(v._id, 'Rejected')}>Reject</Button>}
          </div>
        </div>
      ))}
    </div>
  )
}
