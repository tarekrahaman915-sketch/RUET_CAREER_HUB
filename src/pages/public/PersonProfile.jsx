import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import MessageModal from '../../components/ui/MessageModal.jsx'
import PublicationList from '../../components/common/PublicationList.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { findRealPerson } from '../../data/realPeople.js'
import { resourcesFor } from '../../data/careerResources.js'
import { getPath, pathProgress } from '../../data/careerPaths.js'

export default function PersonProfile() {
  const { id } = useParams()
  const { user, isSignedIn } = useAuth()
  const [person, setPerson] = useState(null)
  const [projects, setProjects] = useState([])
  const [isSample, setIsSample] = useState(false)
  const [state, setState] = useState('loading') // loading | ok | missing
  const [msgOpen, setMsgOpen] = useState(false)

  useEffect(() => {
    setState('loading')
    if (String(id).startsWith('fac-') || String(id).startsWith('stu-')) {
      const p = findRealPerson(id)
      setPerson(p || null)
      setProjects([])
      setIsSample(true)
      setState(p ? 'ok' : 'missing')
      return
    }
    api
      .get(`/people/${id}`)
      .then((d) => {
        setPerson(d.person)
        setProjects(d.projects || [])
        setIsSample(false)
        setState('ok')
      })
      .catch(() => setState('missing'))
  }, [id, isSignedIn])

  if (state === 'loading') return <main className="page"><div className="wrap"><p className="board-empty">Loading…</p></div></main>
  if (state === 'missing' || !person)
    return (
      <main className="page"><div className="wrap">
        <h1>Profile not found</h1>
        <p className="lead">This person may not be approved yet, or the link is wrong.</p>
        <Button to="/people" variant="secondary">← Back to People</Button>
      </div></main>
    )

  const sp = person.studentProfile || {}
  const ap = person.alumniProfile || {}
  const links = { ...(person.contactLinks || {}) }
  if (!links.github && sp.portfolio?.github) links.github = sp.portfolio.github
  if (!links.linkedin && sp.portfolio?.linkedin) links.linkedin = sp.portfolio.linkedin
  if (!links.website && sp.portfolio?.website) links.website = sp.portfolio.website
  // Career paths and roadmaps exist for students only.
  const isStudent = person.role === 'Student'
  const path = isStudent ? getPath(person.careerPath?.primary) : null
  const extraPaths = isStudent ? (person.careerPath?.interests || []).map(getPath).filter(Boolean) : []
  const ac = person.academicLinks || {}
  const picks = path ? resourcesFor(path.id).slice(0, 4) : []
  const progress = path ? pathProgress(path, person.roadmapProgress?.[path.id] || []) : null
  const isMe = user && String(user._id) === String(person._id)
  const headline = person.headline || (person.role === 'Alumni' && ap.jobPosition?.position ? `${ap.jobPosition.position} at ${ap.jobPosition.company}` : '')

  return (
    <main className="page">
      <div className="wrap profile-wrap">
        <Link to="/people" className="back-link">← All people</Link>
        {person.unclaimed && (
          <div className="claim-banner">
            <b>This profile hasn't been claimed yet.</b> Only the name, department and batch from the ETE roster are shown. Are you {person.name.split(' ')[0]}? <Link to="/register">Create your profile</Link> to add a photo, portfolio, publications and your career path.
          </div>
        )}

        <section className="profile-hero">
          <Avatar person={person} size={120} style={{ fontSize: 44 }} />
          <div className="profile-hero-main">
            <h1 style={{ margin: 0 }}>{person.name}</h1>
            <p className="person-sub" style={{ fontSize: 15 }}>{person.designation || person.role} · {person.department || 'No department set'}{sp.batch ? ` · Batch ${sp.batch}` : ''}</p>
            {headline && <p style={{ margin: '8px 0 0', color: 'var(--text-mute)' }}>{headline}</p>}
            <div className="entry-tags" style={{ marginTop: 12 }}>
              {ap.mentor?.isMentor && <span className="tag tag-teal">Available as mentor</span>}
              {path && <span className="tag">{path.icon} {path.title}</span>}
            </div>
            <div className="contact-row" style={{ borderTop: 'none', marginTop: 14, paddingTop: 0 }}>
              {isMe ? (
                <Button to={`/${person.role.toLowerCase()}`} variant="secondary">Edit in dashboard</Button>
              ) : (
                <>
                  {!person.isReal && <Button variant="primary" onClick={() => setMsgOpen(true)}>Message</Button>}
                  {person.email ? (
                    isSignedIn || !person.isReal ? <Button href={`mailto:${person.email}`} variant="secondary">{person.email}</Button> : <Link className="contact-note" to="/login">Sign in to see email</Link>
                  ) : !isSignedIn && !person.isReal ? (
                    <Link className="contact-note" to="/login">Sign in to see email</Link>
                  ) : null}
                  {person.officialProfile && <Button href={person.officialProfile} variant="ghost" target="_blank">Official RUET profile ↗</Button>}
                </>
              )}
              {links.phone && isSignedIn && <a className="btn btn-ghost" href={`tel:${links.phone}`}>{links.phone}</a>}
            </div>
          </div>
        </section>

        <div className="profile-cols">
          <div>
            {person.bio && (
              <section className="profile-section">
                <h2>About</h2>
                <p style={{ color: 'var(--text-mute)', whiteSpace: 'pre-line' }}>{person.bio}</p>
              </section>
            )}

            {person.education?.length > 0 && (
              <section className="profile-section">
                <h2>Education</h2>
                <ul className="check-list">{person.education.map((e) => <li key={e}>{e}</li>)}</ul>
              </section>
            )}
            {person.researchAreas?.length > 0 && (
              <section className="profile-section">
                <h2>Research areas</h2>
                <div className="entry-tags">{person.researchAreas.map((a) => <span className="tag tag-teal" key={a}>{a}</span>)}</div>
              </section>
            )}

            <section className="profile-section">
              <h2>Portfolio</h2>
              {links.github || links.linkedin || links.website || ac.scholar || ac.researchgate || ac.orcid || person.officialProfile ? (
                <div className="portfolio-cards">
                  {person.officialProfile && <a className="portfolio-card" href={person.officialProfile} target="_blank" rel="noreferrer"><b>Official RUET profile</b><span>{person.officialProfile.replace(/^https?:\/\//, '')}</span></a>}
                  {ac.scholar && <a className="portfolio-card" href={ac.scholar} target="_blank" rel="noreferrer"><b>Google Scholar</b><span>scholar.google.com</span></a>}
                  {ac.researchgate && <a className="portfolio-card" href={ac.researchgate} target="_blank" rel="noreferrer"><b>ResearchGate</b><span>researchgate.net</span></a>}
                  {ac.orcid && <a className="portfolio-card" href={ac.orcid} target="_blank" rel="noreferrer"><b>ORCID</b><span>{ac.orcid.replace(/^https?:\/\//, '')}</span></a>}
                  {links.github && <a className="portfolio-card" href={links.github} target="_blank" rel="noreferrer"><b>GitHub</b><span>{links.github.replace(/^https?:\/\//, '')}</span></a>}
                  {links.linkedin && <a className="portfolio-card" href={links.linkedin} target="_blank" rel="noreferrer"><b>LinkedIn</b><span>{links.linkedin.replace(/^https?:\/\//, '')}</span></a>}
                  {links.website && <a className="portfolio-card" href={links.website} target="_blank" rel="noreferrer"><b>Website</b><span>{links.website.replace(/^https?:\/\//, '')}</span></a>}
                </div>
              ) : (
                <p className="board-empty">No portfolio links added yet.</p>
              )}
              {projects.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {projects.map((pr) => (
                    <div className="entry-card" key={pr._id}>
                      <div className="entry-title">{pr.title}</div>
                      {pr.description && <div className="entry-desc">{pr.description}</div>}
                      {pr.techStack?.length > 0 && <div className="entry-tags">{pr.techStack.map((t) => <span className="tag tag-teal" key={t}>{t}</span>)}</div>}
                      <div className="entry-links">
                        {pr.github && <a href={pr.github} target="_blank" rel="noreferrer">Code ↗</a>}
                        {pr.demo && <a href={pr.demo} target="_blank" rel="noreferrer">Demo ↗</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="profile-section">
              <h2>Publications</h2>
              <PublicationList publications={person.publications} empty={person.isReal && person.role === 'Faculty' ? 'The full publication list is on this teacher’s official RUET profile.' : 'No publications listed yet.'} />
              {person.isReal && person.role === 'Faculty' && person.officialProfile && (
                <p className="sch-fineprint">Source: <a href={person.officialProfile} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>official ETE department profile ↗</a>{person.hasFullDetails ? ' — a selection of publications is shown here; the profile has the complete bibliography.' : ''}</p>
              )}
            </section>
          </div>

          <aside>
            {path && (
              <section className="profile-section side-card">
                <h3>Career path</h3>
                <Link to={`/careers/${path.id}`} className="side-path">
                  <span style={{ fontSize: 28 }}>{path.icon}</span>
                  <span><b>{path.title}</b><small>{path.tagline}</small></span>
                </Link>
                {progress && progress.done > 0 && (
                  <>
                    <div className="progress" aria-label={`Roadmap ${progress.pct}% complete`}><div style={{ width: `${progress.pct}%` }} /></div>
                    <small style={{ color: 'var(--text-faint)' }}>Roadmap {progress.pct}% complete</small>
                  </>
                )}
                {picks.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <span className="mini-label">Learning with</span>
                    <ul className="check-list" style={{ marginTop: 8 }}>
                      {picks.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{r.title} ↗</a></li>)}
                    </ul>
                  </div>
                )}
                {extraPaths.length > 0 && <div className="entry-tags" style={{ marginTop: 10 }}>{extraPaths.map((x) => <Link key={x.id} to={`/careers/${x.id}`} className="tag tag-teal">{x.title}</Link>)}</div>}
              </section>
            )}

            {person.role === 'Student' && (sp.skills?.length > 0 || sp.researchInterest || sp.careerInterest) && (
              <section className="profile-section side-card">
                <h3>Skills & interests</h3>
                {sp.skills?.length > 0 && <div className="entry-tags">{sp.skills.map((s) => <span className="tag" key={s}>{s}</span>)}</div>}
                {sp.researchInterest && <p className="entry-desc">Research: {sp.researchInterest}</p>}
                {sp.careerInterest && <p className="entry-desc">Career: {sp.careerInterest}</p>}
              </section>
            )}

            {ap.mentor?.isMentor && (
              <section className="profile-section side-card">
                <h3>Mentorship</h3>
                {ap.mentor.bio && <p className="entry-desc">{ap.mentor.bio}</p>}
                {ap.mentor.expertise?.length > 0 && <div className="entry-tags">{ap.mentor.expertise.map((e) => <span className="tag tag-teal" key={e}>{e}</span>)}</div>}
                {!isMe && <Button variant="primary" block onClick={() => setMsgOpen(true)} style={{ marginTop: 12 }}>Ask about mentoring</Button>}
              </section>
            )}

            {sp.certifications?.length > 0 && (
              <section className="profile-section side-card">
                <h3>Certifications</h3>
                {sp.certifications.map((c, i) => (
                  <p key={c._id || i} className="entry-desc" style={{ margin: '0 0 6px' }}>
                    {c.link ? <a href={c.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{c.name} ↗</a> : c.name}
                    {c.issuer ? ` · ${c.issuer}` : ''}
                  </p>
                ))}
              </section>
            )}
          </aside>
        </div>
      </div>
      <MessageModal person={person} isOpen={msgOpen} onClose={() => setMsgOpen(false)} />
    </main>
  )
}
