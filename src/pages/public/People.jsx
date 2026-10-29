import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import MessageModal from '../../components/ui/MessageModal.jsx'
import { DEPARTMENTS } from '../../utils/departments.js'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { REAL_PEOPLE } from '../../data/realPeople.js'
import { getPath } from '../../data/careerPaths.js'

const ROLES = ['All', 'Student', 'Alumni', 'Faculty']
const PAGE = 24

export default function People() {
  const { user, isSignedIn } = useAuth()
  const [role, setRole] = useState('All')
  const [department, setDepartment] = useState('All')
  const [q, setQ] = useState('')
  const [live, setLive] = useState(null)
  const [messageTo, setMessageTo] = useState(null)
  const [shown, setShown] = useState(PAGE)

  // Registered (approved) members from the server; signed-in viewers also get emails.
  useEffect(() => {
    api.get('/people').then((d) => setLive(d.people)).catch(() => setLive([]))
  }, [isSignedIn])

  // Registered members first, then the real RUET faculty/student records (skip
  // any record whose email/name matches a registered member).
  const source = useMemo(() => {
    const liveList = live || []
    const emails = new Set(liveList.map((p) => (p.email || '').toLowerCase()).filter(Boolean))
    const names = new Set(liveList.map((p) => p.name.toLowerCase()))
    const rest = REAL_PEOPLE.filter((p) => !emails.has((p.email || '').toLowerCase()) && !names.has(p.name.toLowerCase()))
    return [...liveList, ...rest]
  }, [live])

  const people = useMemo(() => {
    const n = q.trim().toLowerCase()
    return source.filter(
      (p) =>
        (role === 'All' || p.role === role) &&
        (department === 'All' || p.department === department) &&
        (!n ||
          `${p.name} ${p.department} ${p.designation || ''} ${p.headline || ''} ${p.studentId || ''} ${(p.researchAreas || []).join(' ')} ${p.alumniProfile?.jobPosition?.company || ''} ${(p.publications || []).map((x) => x.title).join(' ')}`
            .toLowerCase()
            .includes(n))
    )
  }, [source, role, department, q])

  useEffect(() => setShown(PAGE), [role, department, q])

  return (
    <main className="page">
      <div className="wrap">
        <h1>People across RUET</h1>
        <p className="lead">
          Faculty from the Department of ETE (taken from the official RUET site), ETE students, and members who have joined the platform. Open a profile for portfolio and publications.
        </p>
        {!isSignedIn && (
          <p className="people-signin-hint">
            <Link to="/login">Sign in</Link> to message members and see email addresses.
          </p>
        )}

        <div className="people-filters">
          <input className="ui-input" placeholder="Search by name, research area, ID or paper" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search people" />
          <select className="ui-input" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Category">
            {ROLES.map((r) => <option key={r} value={r}>{r === 'All' ? 'All categories' : r}</option>)}
          </select>
          <select className="ui-input" value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Department">
            <option value="All">All departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <p className="people-count">{people.length} {people.length === 1 ? 'person' : 'people'}</p>

        {people.length === 0 && <p className="board-empty">No one matches those filters yet.</p>}

        <div className="page-grid people-grid">
          {people.slice(0, shown).map((p) => {
            const links = { ...(p.contactLinks || {}) }
            if (!links.github && p.studentProfile?.portfolio?.github) links.github = p.studentProfile.portfolio.github
            if (!links.linkedin && p.studentProfile?.portfolio?.linkedin) links.linkedin = p.studentProfile.portfolio.linkedin
            if (!links.website && p.studentProfile?.portfolio?.website) links.website = p.studentProfile.portfolio.website
            const ac = p.academicLinks || {}
            const path = p.role === 'Student' ? getPath(p.careerPath?.primary) : null // career paths are for students only
            const pubs = p.publications || []
            const isMe = user && String(user._id) === String(p._id)
            const canMessage = !p.isReal
            return (
              <Card key={p._id}>
                <Link to={`/people/${p._id}`} className="person-head">
                  <Avatar person={p} size={64} />
                  <div style={{ minWidth: 0 }}>
                    <div className="ui-card-title">{p.name}</div>
                    <p className="person-sub">{p.designation || p.role}{p.studentId ? '' : ` · ${p.department || 'No department set'}`}</p>
                    {p.studentId && <p className="person-sub" style={{ color: 'var(--text-faint)' }}>ETE · Batch {p.studentProfile.batch}</p>}
                  </div>
                </Link>

                {(p.headline || (p.role === 'Alumni' && p.alumniProfile?.jobPosition?.position)) && !p.studentId && (
                  <p className="entry-desc" style={{ margin: 0 }}>{p.headline || `${p.alumniProfile.jobPosition.position} at ${p.alumniProfile.jobPosition.company}`}</p>
                )}
                {p.researchAreas?.length > 0 && <div className="entry-tags">{p.researchAreas.slice(0, 3).map((a) => <span className="tag tag-teal" key={a}>{a}</span>)}</div>}

                <div className="entry-tags">
                  {p.role === 'Alumni' && p.alumniProfile?.mentor?.isMentor && <span className="tag tag-teal">Available as mentor</span>}
                  {path && <span className="tag">{path.icon} {path.title}</span>}
                  {pubs.length > 0 && <span className="tag tag-amber">{pubs.length} publication{pubs.length > 1 ? 's' : ''} listed</span>}
                  {p.unclaimed && <span className="tag">Not on the platform yet</span>}
                </div>

                {(links.github || links.linkedin || links.website || ac.scholar || ac.researchgate || p.officialProfile) && (
                  <div className="entry-links portfolio-links">
                    <span className="mini-label">Portfolio</span>
                    {p.officialProfile && <a href={p.officialProfile} target="_blank" rel="noreferrer">RUET profile ↗</a>}
                    {ac.scholar && <a href={ac.scholar} target="_blank" rel="noreferrer">Google Scholar ↗</a>}
                    {ac.researchgate && <a href={ac.researchgate} target="_blank" rel="noreferrer">ResearchGate ↗</a>}
                    {links.github && <a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                    {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
                    {links.website && <a href={links.website} target="_blank" rel="noreferrer">Website ↗</a>}
                  </div>
                )}

                <div className="contact-row">
                  <span className="mini-label">Contact</span>
                  {isMe ? (
                    <span className="contact-note">This is you</span>
                  ) : canMessage ? (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => setMessageTo(p)}>Message</button>
                      {p.email ? <a className="btn btn-secondary btn-sm" href={`mailto:${p.email}`}>Email</a> : !isSignedIn && <Link className="contact-note" to="/login">Sign in to see email</Link>}
                    </>
                  ) : p.email ? (
                    isSignedIn ? <a className="btn btn-secondary btn-sm" href={`mailto:${p.email}`}>Email</a> : <Link className="contact-note" to="/login">Sign in to see email</Link>
                  ) : (
                    <span className="contact-note">Joins the platform by registering</span>
                  )}
                  <Link className="btn btn-ghost btn-sm" to={`/people/${p._id}`} style={{ marginLeft: 'auto' }}>Profile →</Link>
                </div>
              </Card>
            )
          })}
        </div>

        {shown < people.length && (
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button className="btn btn-secondary" onClick={() => setShown((s) => s + PAGE)}>Show more ({people.length - shown} more)</button>
          </div>
        )}
      </div>

      <MessageModal person={messageTo} isOpen={Boolean(messageTo)} onClose={() => setMessageTo(null)} />
    </main>
  )
}
