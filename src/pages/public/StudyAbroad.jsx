import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import api from '../../services/apiClient.js'
import { isAuthenticated, getCurrentRole, isStudent } from '../../utils/auth.js'
import { SAMPLE_SCHOLARSHIPS, COUNTRY_FLAGS, LEVELS, FUNDINGS, daysLeft } from '../../data/sampleScholarships.js'

export const TRACK_STATUSES = ['Saved', 'Preparing', 'Applied', 'Shortlisted', 'Awarded', 'Rejected']
export const STATUS_TAG = {
  Saved: '',
  Preparing: 'tag-amber',
  Applied: '',
  Shortlisted: 'tag-teal',
  Awarded: 'tag-green',
  Rejected: 'tag-red',
}

const POSTERS = ['Faculty', 'Alumni', 'Admin']
const EMPTY_FORM = {
  title: '', provider: '', country: '', level: 'Masters', funding: 'Fully funded', amount: '',
  deadline: '', fields: '', eligibility: '', description: '', link: '',
}

function DeadlineLabel({ deadline }) {
  const d = daysLeft(deadline)
  if (d === null) return <span className="sch-deadline">No deadline listed</span>
  if (d < 0) return <span className="sch-deadline closed">Closed {deadline}</span>
  return (
    <span className={`sch-deadline ${d <= 21 ? 'soon' : ''}`}>
      {d === 0 ? 'Closes today' : `${d} day${d === 1 ? '' : 's'} left`} · {deadline}
    </span>
  )
}

export default function StudyAbroad() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)
  const [tracker, setTracker] = useState({}) // scholarshipId -> { status, note }
  const [openId, setOpenId] = useState(params.get('open'))
  const [posting, setPosting] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const [q, setQ] = useState(params.get('q') || '')
  const [country, setCountry] = useState('All')
  const [level, setLevel] = useState('All')
  const [funding, setFunding] = useState('All')
  const [openOnly, setOpenOnly] = useState(true)
  const [sort, setSort] = useState('deadline')

  const student = isStudent()
  const role = getCurrentRole()
  const canPost = isAuthenticated() && POSTERS.includes(role)

  useEffect(() => {
    api
      .get('/scholarships')
      .then((data) => {
        if (data.scholarships?.length) setItems(data.scholarships)
        else {
          setItems(SAMPLE_SCHOLARSHIPS)
          setUsingSample(true)
        }
      })
      .catch(() => {
        setItems(SAMPLE_SCHOLARSHIPS)
        setUsingSample(true)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!student || usingSample) return
    api
      .get('/scholarships/me/tracker')
      .then((data) => {
        const map = {}
        data.items.forEach((i) => (map[i.scholarship._id] = { status: i.status, note: i.note }))
        setTracker(map)
      })
      .catch(() => {})
  }, [student, usingSample])

  const countries = useMemo(() => ['All', ...[...new Set(items.map((i) => i.country))].sort()], [items])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = items.filter((s) => {
      if (needle && !`${s.title} ${s.provider} ${s.country} ${(s.fields || []).join(' ')}`.toLowerCase().includes(needle)) return false
      if (country !== 'All' && s.country !== country) return false
      if (level !== 'All' && s.level !== level) return false
      if (funding !== 'All' && s.funding !== funding) return false
      if (openOnly) {
        const d = daysLeft(s.deadline)
        if (d !== null && d < 0) return false
      }
      return true
    })
    out.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      const da = daysLeft(a.deadline)
      const db = daysLeft(b.deadline)
      return (da ?? 9999) - (db ?? 9999)
    })
    return out
  }, [items, q, country, level, funding, openOnly, sort])

  const selected = items.find((s) => s._id === openId) || null

  const closeDetails = () => {
    setOpenId(null)
    if (params.get('open')) {
      const next = new URLSearchParams(params)
      next.delete('open')
      setParams(next, { replace: true })
    }
  }

  const track = async (id, patch) => {
    const prev = tracker[id]
    setTracker((t) => ({ ...t, [id]: { status: 'Saved', note: '', ...t[id], ...patch } }))
    try {
      await api.post(`/scholarships/${id}/track`, patch)
    } catch {
      setTracker((t) => {
        const copy = { ...t }
        if (prev) copy[id] = prev
        else delete copy[id]
        return copy
      })
    }
  }

  const untrack = async (id) => {
    const prev = tracker[id]
    setTracker((t) => {
      const copy = { ...t }
      delete copy[id]
      return copy
    })
    try {
      await api.delete(`/scholarships/${id}/track`)
    } catch {
      setTracker((t) => ({ ...t, [id]: prev }))
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Remove this scholarship from the board?')) return
    try {
      await api.delete(`/scholarships/${id}`)
      setItems((list) => list.filter((s) => s._id !== id))
      closeDetails()
    } catch (err) {
      alert(err.message)
    }
  }

  const submitPost = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const body = { ...form, fields: form.fields.split(',').map((x) => x.trim()).filter(Boolean) }
      const { scholarship } = await api.post('/scholarships', body)
      setItems((list) => (usingSample ? [scholarship] : [scholarship, ...list]))
      setUsingSample(false)
      setForm(EMPTY_FORM)
      setPosting(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <main className="page">
      <div className="wrap">
        <div className="page-head">
          <div>
            <h1>Study abroad</h1>
            <p className="lead">
              Scholarships and funded programmes posted by RUET faculty and alumni.{' '}
              {!student && (
                <>
                  <Link to="/login" style={{ color: 'var(--signal)' }}>Sign in as a student</Link> to save them and track your
                  applications.
                </>
              )}
            </p>
          </div>
          {canPost && (
            <Button variant="primary" onClick={() => setPosting(true)}>Post a scholarship</Button>
          )}
        </div>

        {usingSample && (
          <div className="notice-bar">
            Showing sample scholarships because the server has no data yet. Run <code>npm run seed</code> in the server folder, or post one
            yourself as faculty or alumni. Deadlines and terms change, so confirm everything on the official page.
          </div>
        )}

        <div className="sch-filters">
          <input className="ui-input sch-search" placeholder="Search by scholarship, country or field" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search scholarships" />
          <select className="ui-input" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
            {countries.map((c) => <option key={c} value={c}>{c === 'All' ? 'All countries' : c}</option>)}
          </select>
          <select className="ui-input" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Level">
            {LEVELS.map((c) => <option key={c} value={c}>{c === 'All' ? 'All levels' : c}</option>)}
          </select>
          <select className="ui-input" value={funding} onChange={(e) => setFunding(e.target.value)} aria-label="Funding">
            {FUNDINGS.map((c) => <option key={c} value={c}>{c === 'All' ? 'Any funding' : c}</option>)}
          </select>
          <select className="ui-input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="deadline">Closing soonest</option>
            <option value="newest">Newest first</option>
          </select>
          <label className="job-remote-toggle">
            <input type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} /> Open only
          </label>
        </div>

        {!loading && filtered.length === 0 && <p className="board-empty">No scholarships match those filters.</p>}

        <div className="sch-grid">
          {filtered.map((s) => {
            const tr = tracker[s._id]
            return (
              <article className="sch-card" key={s._id}>
                <div className="sch-card-top">
                  <span className="sch-flag" aria-hidden="true">{COUNTRY_FLAGS[s.country] || '🌍'}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.provider} · {s.country}</p>
                  </div>
                </div>
                <div className="entry-tags">
                  <span className="tag">{s.level}</span>
                  <span className={`tag ${s.funding === 'Fully funded' ? 'tag-green' : 'tag-amber'}`}>{s.funding}</span>
                  {tr && <span className={`tag ${STATUS_TAG[tr.status]}`}>{tr.status}</span>}
                </div>
                {s.amount && <p className="sch-amount">{s.amount}</p>}
                <DeadlineLabel deadline={s.deadline} />
                <div className="sch-actions">
                  <Button variant="secondary" onClick={() => setOpenId(s._id)}>Details</Button>
                  {student && !usingSample && (
                    tr ? (
                      <Button variant="ghost" onClick={() => untrack(s._id)}>Remove from tracker</Button>
                    ) : (
                      <Button variant="ghost" onClick={() => track(s._id, { status: 'Saved' })}>Save</Button>
                    )
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <aside className="abroad-help">
          <h3>Not sure where to start?</h3>
          <p>
            Alumni who studied abroad can look over your SOP and tell you what the process was really like.
            {student ? (
              <> <Link to="/student/mentorship" style={{ color: 'var(--signal)' }}>Book a mentor session.</Link></>
            ) : (
              <> <Link to="/register" style={{ color: 'var(--signal)' }}>Create a student profile</Link> to book one.</>
            )}
          </p>
        </aside>
      </div>

      {/* Details */}
      <Modal isOpen={Boolean(selected)} onClose={closeDetails} title={selected?.title} wide>
        {selected && (
          <div className="sch-detail">
            <p className="sch-detail-sub">
              <span aria-hidden="true">{COUNTRY_FLAGS[selected.country] || '🌍'}</span> {selected.provider} · {selected.country}
            </p>
            <div className="entry-tags">
              <span className="tag">{selected.level}</span>
              <span className={`tag ${selected.funding === 'Fully funded' ? 'tag-green' : 'tag-amber'}`}>{selected.funding}</span>
              {(selected.fields || []).map((f) => <span className="tag tag-teal" key={f}>{f}</span>)}
            </div>
            <dl className="sch-dl">
              {selected.amount && (<><dt>Covers</dt><dd>{selected.amount}</dd></>)}
              <dt>Deadline</dt><dd><DeadlineLabel deadline={selected.deadline} /></dd>
              {selected.eligibility && (<><dt>Who can apply</dt><dd>{selected.eligibility}</dd></>)}
              {selected.description && (<><dt>About</dt><dd>{selected.description}</dd></>)}
            </dl>

            {student && !usingSample && (
              <div className="sch-track">
                <label className="ui-field">
                  <span className="ui-label">Your status</span>
                  <select
                    className="ui-input"
                    value={tracker[selected._id]?.status || ''}
                    onChange={(e) => e.target.value && track(selected._id, { status: e.target.value })}
                  >
                    <option value="">Not tracking</option>
                    {TRACK_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </label>
                {tracker[selected._id] && (
                  <label className="ui-field">
                    <span className="ui-label">Private note</span>
                    <textarea
                      className="ui-input"
                      rows={2}
                      defaultValue={tracker[selected._id].note}
                      placeholder="Documents still needed, referee names, anything you want to remember"
                      onBlur={(e) => e.target.value !== tracker[selected._id].note && track(selected._id, { note: e.target.value })}
                    />
                  </label>
                )}
              </div>
            )}

            <div className="sch-actions" style={{ marginTop: 18 }}>
              {selected.link && <Button href={selected.link} variant="primary">Open official page</Button>}
              {canPost && !usingSample && (
                <Button variant="ghost" onClick={() => remove(selected._id)}>Remove posting</Button>
              )}
            </div>
            <p className="sch-fineprint">Always confirm dates and eligibility on the official page before you apply.</p>
          </div>
        )}
      </Modal>

      {/* Post */}
      <Modal isOpen={posting} onClose={() => setPosting(false)} title="Post a scholarship" wide>
        <form className="auth-form" onSubmit={submitPost}>
          <div className="form-grid">
            <label className="ui-field" style={{ gridColumn: '1 / -1' }}>
              <span className="ui-label">Title</span>
              <input className="ui-input" required value={form.title} onChange={setF('title')} placeholder="e.g. DAAD Master’s Scholarship" />
            </label>
            <label className="ui-field">
              <span className="ui-label">Provider</span>
              <input className="ui-input" value={form.provider} onChange={setF('provider')} placeholder="University or funding body" />
            </label>
            <label className="ui-field">
              <span className="ui-label">Country</span>
              <input className="ui-input" required list="country-list" value={form.country} onChange={setF('country')} />
              <datalist id="country-list">{Object.keys(COUNTRY_FLAGS).map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label className="ui-field">
              <span className="ui-label">Level</span>
              <select className="ui-input" value={form.level} onChange={setF('level')}>
                {LEVELS.filter((l) => l !== 'All').map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="ui-field">
              <span className="ui-label">Funding</span>
              <select className="ui-input" value={form.funding} onChange={setF('funding')}>
                {FUNDINGS.filter((l) => l !== 'All').map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="ui-field">
              <span className="ui-label">What it covers</span>
              <input className="ui-input" value={form.amount} onChange={setF('amount')} placeholder="Tuition, stipend, flights" />
            </label>
            <label className="ui-field">
              <span className="ui-label">Deadline</span>
              <input className="ui-input" type="date" value={form.deadline} onChange={setF('deadline')} />
            </label>
            <label className="ui-field" style={{ gridColumn: '1 / -1' }}>
              <span className="ui-label">Fields (comma separated)</span>
              <input className="ui-input" value={form.fields} onChange={setF('fields')} placeholder="Engineering, Robotics" />
            </label>
            <label className="ui-field" style={{ gridColumn: '1 / -1' }}>
              <span className="ui-label">Who can apply</span>
              <textarea className="ui-input" rows={2} value={form.eligibility} onChange={setF('eligibility')} />
            </label>
            <label className="ui-field" style={{ gridColumn: '1 / -1' }}>
              <span className="ui-label">About</span>
              <textarea className="ui-input" rows={3} value={form.description} onChange={setF('description')} />
            </label>
            <label className="ui-field" style={{ gridColumn: '1 / -1' }}>
              <span className="ui-label">Official link</span>
              <input className="ui-input" type="url" value={form.link} onChange={setF('link')} placeholder="https://" />
            </label>
          </div>
          {formError && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{formError}</p>}
          <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Posting…' : 'Post scholarship'}</Button>
        </form>
      </Modal>
    </main>
  )
}
