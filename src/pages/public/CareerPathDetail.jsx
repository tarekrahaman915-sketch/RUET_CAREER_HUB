import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getPath, pathProgress } from '../../data/careerPaths.js'
import { resourcesFor } from '../../data/careerResources.js'
import useCareerPlan from '../../hooks/useCareerPlan.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Avatar from '../../components/ui/Avatar.jsx'
import PathImage from '../../components/common/PathImage.jsx'
import Roadmap from '../../components/common/Roadmap.jsx'
import { REAL_FACULTY } from '../../data/realPeople.js'
import api from '../../services/apiClient.js'

const List = ({ items }) => <ul className="check-list">{items.map((d) => <li key={d}>{d}</li>)}</ul>

const TABS = [
  ['overview', 'Path details'],
  ['guide', 'Step-by-step guideline'],
  ['roadmap', 'Learning roadmap'],
  ['resources', 'Resources'],
  ['people', 'People'],
]

/** The full body for one career path. Used on the public page and inside the student dashboard. */
export function PathWorkspace({ path, tab, setTab }) {
  const { plan, choose, toggleInterest, toggleStep, isSignedIn, canSave, error } = useCareerPlan()
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const isChosen = plan.primary === path.id
  const isInterest = plan.interests.includes(path.id)
  const pr = pathProgress(path, plan.progress[path.id] || [])
  const g = path.guide
  const resources = resourcesFor(path.id)

  useEffect(() => {
    if (tab !== 'people') return
    api.get('/people?role=Student').then((d) => setMembers(d.people.filter((p) => p.careerPath?.primary === path.id))).catch(() => setMembers([]))
  }, [tab, path.id])

  // Teachers whose research matches this path (keyword match on real research areas)
  const KEY = { software: ['software', 'computing', 'cloud'], 'ai-ml': ['machine learning', 'artificial', 'ai'], embedded: ['rf', 'circuit', 'iot', 'embedded', 'antenna'], 'power-energy': ['power', 'renewable', 'energy', 'drive'], telecom: ['5g', '6g', 'wireless', 'mimo', 'ran', 'antenna'], research: [''], civil: ['__none__'], mechanical: ['__none__'], 'govt-mgmt': ['__none__'] }
  const faculty = REAL_FACULTY.filter((f) => f.researchAreas.length && (KEY[path.id] || []).some((k) => f.researchAreas.join(' ').toLowerCase().includes(k)))

  return (
    <>
      <PathImage title={g.wiki} local={path.localImage} icon={path.icon} alt={path.title} height={220} credit className="path-banner" />
      <header className="path-hero">
        <div className="career-icon big">{path.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0 }}>{path.title}</h1>
          <p className="lead" style={{ marginTop: 6 }}>{path.tagline}</p>
          <div className="entry-tags" style={{ marginTop: 10 }}>
            {path.departments.map((d) => <span key={d} className="tag">{d === 'All' ? 'All departments' : d}</span>)}
          </div>
        </div>
        <div className="path-actions">
          {isChosen ? <span className="tag tag-green" style={{ alignSelf: 'flex-start' }}>✓ Your chosen path</span> : <Button variant="primary" onClick={() => choose(path.id)}>Choose this path</Button>}
          {!isChosen && <button className="btn btn-ghost btn-sm" onClick={() => toggleInterest(path.id)}>{isInterest ? '★ In my interests' : '☆ Add to interests'}</button>}
        </div>
      </header>
      {error && <p className="claim-banner" style={{ borderLeftColor: 'var(--danger)' }}>{error}</p>}
      {!isSignedIn && <p className="people-signin-hint">You are exploring as a visitor: your choice and progress are kept in this browser. <Link to="/login">Sign in as a student</Link> to save them to your profile.</p>}
      {isSignedIn && user.role !== 'Student' && <p className="people-signin-hint">Career paths and roadmaps are for student accounts. You can still read everything here.</p>}

      <div className="tab-row" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={`tab-btn ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>
            {k === 'roadmap' ? `${label} (${pr.pct}%)` : label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="path-cols">
          <div>
            <section className="profile-section"><h2>What this path is</h2><p style={{ color: 'var(--text-mute)' }}>{path.overview}</p></section>
            <section className="profile-section"><h2>A typical day</h2><List items={path.dayToDay} /></section>
            <section className="profile-section">
              <h2>Career ladder</h2>
              <div className="ladder">
                {path.ladder.map((l, i) => (
                  <div className="ladder-step" key={l.level}><span className="ladder-n">{i + 1}</span><div><b>{l.level}</b><p>{l.roles.join(' · ')}</p></div></div>
                ))}
              </div>
            </section>
            <section className="profile-section"><h2>Is it a good fit?</h2><p style={{ color: 'var(--text-mute)' }}>{path.goodFit}</p><p style={{ color: 'var(--text-mute)' }}><b>Degree fit:</b> {g.degreeFit}</p></section>
          </div>
          <aside>
            <section className="side-card profile-section"><h3>Skills to build</h3><div className="entry-tags">{path.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div></section>
            <section className="side-card profile-section"><h3>Tools</h3><div className="entry-tags">{path.tools.map((s) => <span key={s} className="tag tag-teal">{s}</span>)}</div></section>
            <section className="side-card profile-section"><h3>Who hires</h3><List items={path.employers} /></section>
            <Button variant="primary" block onClick={() => setTab('guide')}>Read the step-by-step guideline →</Button>
          </aside>
        </div>
      )}

      {tab === 'guide' && (
        <div className="guide-grid">
          <div className="guide-block"><h3>Your first month</h3><List items={g.firstMonth} /></div>
          <div className="guide-block"><h3>Ways to enter (Bangladesh & abroad)</h3><List items={g.entryRoutes} /></div>
          <div className="guide-block"><h3>Certifications & proof of skill</h3><List items={g.certifications} /></div>
          <div className="guide-block"><h3>Interview preparation</h3><List items={g.interviewPrep} /></div>
          <div className="guide-block"><h3>Common mistakes to avoid</h3><List items={g.mistakes} /></div>
          <div className="guide-block"><h3>Study-abroad angle</h3><p style={{ color: 'var(--text-mute)', margin: 0, fontSize: 14.5 }}>{g.abroad}</p><div style={{ marginTop: 12 }}><Button to="/study-abroad" variant="secondary">Open Study Abroad</Button></div></div>
          <div className="guide-block wide"><h3>Next</h3><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Button variant="primary" onClick={() => setTab('roadmap')}>Follow the learning roadmap</Button><Button variant="secondary" onClick={() => setTab('resources')}>Open learning resources</Button><Button to="/mentors" variant="ghost">Talk to a mentor</Button></div><p className="sch-fineprint">General guidance, not a job guarantee. Check current circulars and talk to people working in this field.</p></div>
        </div>
      )}

      {tab === 'roadmap' && <Roadmap path={path} done={plan.progress[path.id] || []} onToggle={(sid) => toggleStep(path.id, sid)} />}

      {tab === 'resources' && (
        <section>
          <p className="lead" style={{ marginBottom: 16 }}>Real courses, documentation, official bodies and tools for {path.title}. Links open the publisher's own site.</p>
          <div className="res-grid">
            {resources.map((r) => (
              <a key={r.url} className="res-card" href={r.url} target="_blank" rel="noreferrer noopener">
                <span className="res-type">{r.type}</span>
                <b>{r.title} ↗</b>
                <small>{r.provider}</small>
                {r.note && <p>{r.note}</p>}
              </a>
            ))}
          </div>
          <div style={{ marginTop: 18 }}><Button to="/resources" variant="secondary">All resources</Button></div>
        </section>
      )}

      {tab === 'people' && (
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>RUET faculty with related research</h2>
          {faculty.length === 0 && <p className="board-empty">No faculty profile in the directory lists research in this area yet.</p>}
          <div className="page-grid" style={{ marginTop: 12 }}>
            {faculty.map((p) => (
              <Link key={p._id} to={`/people/${p._id}`} className="ui-card person-head">
                <Avatar person={p} size={52} />
                <div style={{ minWidth: 0 }}><div className="ui-card-title">{p.name}</div><p className="person-sub">{p.designation} · {p.researchAreas.slice(0, 2).join(', ')}</p></div>
              </Link>
            ))}
          </div>
          {members.length > 0 && (
            <>
              <h2 style={{ fontSize: 18, margin: '28px 0 12px' }}>Students on this path</h2>
              <div className="page-grid" style={{ marginTop: 12 }}>
                {members.map((p) => (
                  <Link key={p._id} to={`/people/${p._id}`} className="ui-card person-head"><Avatar person={p} size={52} /><div><div className="ui-card-title">{p.name}</div><p className="person-sub">{p.department}</p></div></Link>
                ))}
              </div>
            </>
          )}
          <div style={{ marginTop: 20 }}><Button to="/mentors" variant="secondary">Find an alumni mentor →</Button></div>
        </section>
      )}
    </>
  )
}

export default function CareerPathDetail() {
  const { id } = useParams()
  const path = getPath(id)
  const [params, setParams] = useSearchParams()
  const t = params.get('tab')
  const tab = TABS.some(([k]) => k === t) ? t : 'overview'
  const setTab = (k) => setParams(k === 'overview' ? {} : { tab: k })

  if (!path)
    return (
      <main className="page"><div className="wrap">
        <h1>Path not found</h1>
        <Button to="/careers" variant="secondary">← All career paths</Button>
      </div></main>
    )
  return (
    <main className="page">
      <div className="wrap">
        <Link to="/careers" className="back-link">← All career paths</Link>
        <PathWorkspace path={path} tab={tab} setTab={setTab} />
      </div>
    </main>
  )
}
