import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/apiClient.js'
import Button from '../../components/ui/Button.jsx'
import { TRACK_STATUSES, STATUS_TAG } from '../public/StudyAbroad.jsx'
import { COUNTRY_FLAGS, daysLeft } from '../../data/sampleScholarships.js'

export default function StudentStudyAbroad() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/scholarships/me/tracker')
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const update = async (id, patch) => {
    const res = await api.post(`/scholarships/${id}/track`, patch)
    setItems((list) => list.map((i) => (i.scholarship._id === id ? { ...i, ...res.item, scholarship: i.scholarship } : i)))
  }

  const remove = async (id) => {
    await api.delete(`/scholarships/${id}/track`)
    setItems((list) => list.filter((i) => i.scholarship._id !== id))
  }

  const sorted = [...items].sort((a, b) => (daysLeft(a.scholarship.deadline) ?? 9999) - (daysLeft(b.scholarship.deadline) ?? 9999))

  return (
    <>
      <div className="dash-head">
        <h1>Study abroad tracker</h1>
        <p>Every scholarship you saved, with your status and notes. Closest deadline first.</p>
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <div className="entry-card">
          <b>Nothing tracked yet</b>
          <p className="entry-desc">Save scholarships from the study abroad board and they will show up here.</p>
          <div><Button to="/study-abroad" variant="primary">Browse scholarships</Button></div>
        </div>
      )}

      {sorted.map(({ scholarship: s, status, note }) => {
        const d = daysLeft(s.deadline)
        return (
          <div className="entry-card" key={s._id}>
            <div className="entry-head">
              <div>
                <div className="entry-title">
                  <span aria-hidden="true">{COUNTRY_FLAGS[s.country] || '🌍'}</span> {s.title}
                </div>
                <div className="entry-meta">
                  {s.country} · {s.level} · {d === null ? 'No deadline' : d < 0 ? `Closed ${s.deadline}` : `${d} days left (${s.deadline})`}
                </div>
              </div>
              <span className={`tag ${STATUS_TAG[status]}`}>{status}</span>
            </div>
            <div className="form-grid">
              <label className="ui-field">
                <span className="ui-label">Status</span>
                <select className="ui-input" value={status} onChange={(e) => update(s._id, { status: e.target.value })}>
                  {TRACK_STATUSES.map((st) => <option key={st}>{st}</option>)}
                </select>
              </label>
              <label className="ui-field">
                <span className="ui-label">Note</span>
                <input className="ui-input" defaultValue={note} placeholder="Next step" onBlur={(e) => e.target.value !== note && update(s._id, { note: e.target.value })} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to={`/study-abroad?open=${s._id}`} className="btn btn-secondary">Details</Link>
              {s.link && <a className="btn btn-ghost" href={s.link} target="_blank" rel="noreferrer">Official page</a>}
              <button className="btn btn-ghost" onClick={() => remove(s._id)}>Remove</button>
            </div>
          </div>
        )
      })}
    </>
  )
}
