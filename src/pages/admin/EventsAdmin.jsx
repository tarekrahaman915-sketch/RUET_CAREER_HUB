import { useAdmin } from '../../context/AdminContext.jsx'

export default function EventsAdmin() {
  const { events, removeEvent } = useAdmin()
  return (
    <div>
      <div className="dash-head">
        <h1>Events</h1>
        <p>Moderate any event on the platform, approved or pending.</p>
      </div>
      {events.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No events yet.</p>}
      {events.map((ev) => (
        <div className="entry-card" key={ev._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{ev.title}</div>
              <div className="entry-meta">{[ev.type, ev.organizer, ev.date, ev.status].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => removeEvent(ev._id)} aria-label="Remove event">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
