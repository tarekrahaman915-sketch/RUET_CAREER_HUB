import { Link, useSearchParams } from 'react-router-dom'
import { useStudent } from '../../context/StudentContext.jsx'
import { isStudent } from '../../utils/auth.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'
import SampleNotice from '../../components/common/SampleNotice.jsx'
import useApiOrSample from '../../hooks/useApiOrSample.js'
import { SAMPLE_EVENTS } from '../../data/sampleData.js'

function isPast(dateStr) {
  const d = new Date(dateStr)
  return !isNaN(d) && d < new Date()
}

export default function Events() {
  const { data: events, loading, isSample } = useApiOrSample('/events', (d) => d.events, SAMPLE_EVENTS)
  const { user, setUser } = useStudent()
  const studentSignedIn = isStudent() && !isSample
  const [params] = useSearchParams()
  const needle = (params.get('q') || '').toLowerCase()


  const registeredIds = user?.studentProfile?.registeredEventIds || []

  const toggleRegister = async (eventId) => {
    const res = await api.post(`/events/${eventId}/register`)
    setUser((u) => {
      const ids = u.studentProfile.registeredEventIds
      const nextIds = res.registered ? [...ids, eventId] : ids.filter((id) => id !== eventId)
      return { ...u, studentProfile: { ...u.studentProfile, registeredEventIds: nextIds } }
    })
  }

  return (
    <main className="page">
      <div className="wrap">
        <div className="sec-tag">Events</div>
        <h1>Seminars, workshops, hackathons & fairs.</h1>
        <p className="lead">
          Approved by department faculty. {!studentSignedIn && (
            <>
              <Link to="/login" style={{ color: 'var(--signal)' }}>Sign in as a student</Link> to register and get reminders.
            </>
          )}
        </p>

        {isSample && <SampleNotice>Showing sample events. Start the server and run <code>npm run seed</code> to see live ones and enable registration.</SampleNotice>}

        {!loading && events.length === 0 && (
          <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 30 }}>
            No events approved yet — check back soon.
          </p>
        )}

        <div className="page-grid">
          {events
            .filter((ev) => !needle || `${ev.title} ${ev.type} ${ev.venue} ${ev.organizer}`.toLowerCase().includes(needle))
            .map((ev) => {
            const registered = registeredIds.includes(ev._id)
            const eventPast = isPast(ev.date)
            return (
              <Card key={ev._id} title={ev.title}>
                <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: 0 }}>
                  {[ev.type, ev.organizer, ev.date, ev.venue].filter(Boolean).join(' · ')}
                </p>
                {ev.description && <p className="entry-desc">{ev.description}</p>}
                {studentSignedIn && (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                    <Button variant={registered ? 'ghost' : 'primary'} onClick={() => toggleRegister(ev._id)}>
                      {registered ? '✓ Registered' : 'Register'}
                    </Button>
                    {registered && !eventPast && <span className="chip">Reminder set</span>}
                    {registered && eventPast && (
                      <Button variant="ghost" onClick={() => alert('Certificate download — wire this up to a real generator once available.')}>
                        Download certificate
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
