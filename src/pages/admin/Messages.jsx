import { useAdmin } from '../../context/AdminContext.jsx'

export default function Messages() {
  const { messages } = useAdmin()
  return (
    <div>
      <div className="dash-head">
        <h1>Messages</h1>
        <p>Illustrative inbox — wire this up to real notifications later.</p>
      </div>
      {messages.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No messages.</p>}
      {messages.map((m) => (
        <div className="entry-card" key={m._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{m.subject}</div>
              <div className="entry-meta">From {m.from} · {new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
