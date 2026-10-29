import { useAdmin } from '../../context/AdminContext.jsx'
import Button from '../../components/ui/Button.jsx'

const STATUS_COLOR = {
  PendingApproval: 'var(--warning)',
  Active: 'var(--success)',
  Suspended: 'var(--danger)',
}

export default function Users() {
  const { users, setUserStatus } = useAdmin()
  const sorted = [...users].sort((a, b) => (a.status === 'PendingApproval' ? -1 : 1))

  return (
    <div>
      <div className="dash-head">
        <h1>Users</h1>
        <p>New registrations wait here until approved — they can't sign in until then.</p>
      </div>
      {sorted.map((u) => (
        <div className="entry-card" key={u._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{u.name}</div>
              <div className="entry-meta">{[u.role, u.department, u.email].filter(Boolean).join(' · ')}</div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: STATUS_COLOR[u.status] }}>
              ● {u.status === 'PendingApproval' ? 'Pending' : u.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {u.status !== 'Active' && (
              <Button variant="primary" onClick={() => setUserStatus(u._id, 'Active')}>
                {u.status === 'PendingApproval' ? 'Approve' : 'Reactivate'}
              </Button>
            )}
            {u.status !== 'Suspended' && (
              <Button variant="ghost" onClick={() => setUserStatus(u._id, 'Suspended')}>
                {u.status === 'PendingApproval' ? 'Reject' : 'Suspend'}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
