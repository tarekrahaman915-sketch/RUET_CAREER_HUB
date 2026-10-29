import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import SampleNotice from '../../components/common/SampleNotice.jsx'
import useApiOrSample from '../../hooks/useApiOrSample.js'
import { fileUrl } from '../../services/apiClient.js'
import { DEPARTMENTS } from '../../utils/departments.js'
import { SAMPLE_PROJECTS, SAMPLE_LABS, SAMPLE_PROFESSORS, SAMPLE_PUBLICATIONS } from '../../data/sampleData.js'

const TABS = ['Project Showcase', 'Research Labs', 'Professors', 'Publications']
const TYPE_TAG = { Journal: 'tag', Conference: 'tag-teal', Workshop: 'tag-amber' }

export default function Research() {
  const [tab, setTab] = useState('Project Showcase')
  const [department, setDepartment] = useState('All')
  const [q, setQ] = useState('')
  const { data: showcased, loading, isSample } = useApiOrSample('/projects/showcase', (d) => d.projects, SAMPLE_PROJECTS)

  const match = (text) => !q.trim() || text.toLowerCase().includes(q.trim().toLowerCase())
  const inDept = (d) => department === 'All' || d === department

  const projects = useMemo(() => showcased.filter((p) => inDept(p.student?.department) && match(`${p.title} ${p.description} ${(p.techStack || []).join(' ')}`)), [showcased, department, q])
  const labs = useMemo(() => SAMPLE_LABS.filter((l) => inDept(l.department) && match(`${l.name} ${l.focus}`)), [department, q])
  const professors = useMemo(() => SAMPLE_PROFESSORS.filter((p) => inDept(p.department) && match(`${p.name} ${p.interests}`)), [department, q])
  const publications = useMemo(() => SAMPLE_PUBLICATIONS.filter((p) => match(`${p.title} ${p.authors} ${p.venue}`)), [q])

  const empty = <p className="board-empty">Nothing matches that search.</p>

  return (
    <main className="page">
      <div className="wrap">
        <h1>Labs, professors and student research</h1>
        <p className="lead">Cross-department research at RUET, from ongoing lab work to student project showcases.</p>

        <SampleNotice>
          Labs, professors and publications on this page are fictional examples for the demo.
          {isSample ? ' Projects are samples too until students showcase their own.' : ' Projects are live and come from students.'}
        </SampleNotice>

        <div className="tab-row" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="people-filters" style={{ marginTop: 0 }}>
          <input className="ui-input" placeholder="Search this tab" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          {tab !== 'Publications' && (
            <select className="ui-input" value={department} onChange={(e) => setDepartment(e.target.value)} aria-label="Department">
              <option value="All">All departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>

        {tab === 'Project Showcase' && (
          <>
            {!loading && projects.length === 0 && empty}
            <div className="page-grid">
              {projects.map((p) => (
                <Card key={p._id} title={p.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div className="avatar-circle" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {p.student?.profilePicture ? <img src={fileUrl(p.student.profilePicture.storedAs)} alt={p.student?.name} /> : <span>{(p.student?.name || '?').slice(0, 1).toUpperCase()}</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>{[p.student?.name, (p.student?.department || '').match(/\(([^)]+)\)/)?.[1] || p.student?.department].filter(Boolean).join(' · ')}</p>
                  </div>
                  {p.description && <p className="entry-desc">{p.description}</p>}
                  {p.techStack?.length > 0 && <div className="entry-tags">{p.techStack.map((t) => <span className="chip" key={t}>{t}</span>)}</div>}
                  {(p.github || p.demo) && (
                    <div className="entry-links">
                      {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                      {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Demo ↗</a>}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === 'Research Labs' && (
          <>
            {labs.length === 0 && empty}
            <div className="page-grid">
              {labs.map((lab) => (
                <Card key={lab.name} title={lab.name}>
                  <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>{lab.focus}</p>
                  <div className="entry-tags" style={{ marginTop: 6 }}>
                    <span className="chip">{(lab.department.match(/\(([^)]+)\)/) || [])[1] || lab.department}</span>
                    <span className="chip">Lead: {lab.head}</span>
                    <span className="chip">{lab.members} members</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === 'Professors' && (
          <>
            {professors.length === 0 && empty}
            <div className="page-grid">
              {professors.map((p) => (
                <Card key={p.name} title={p.name}>
                  <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>{p.title} · {(p.department.match(/\(([^)]+)\)/) || [])[1] || p.department}</p>
                  <p className="entry-desc">{p.interests}</p>
                  <Link to={`/people/${p._id}`} style={{ color: 'var(--accent)', fontSize: 13.5 }}>View profile and publications →</Link>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === 'Publications' && (
          <>
            {publications.length === 0 && empty}
            <div className="page-grid">
              {publications.map((p) => (
                <Card key={p.title} title={p.title}>
                  <div className="entry-tags"><span className={`tag ${TYPE_TAG[p.type] || ''}`}>{p.type}</span><span className="chip">{p.year}</span></div>
                  <p style={{ fontSize: 13, color: 'var(--text-mute)', margin: 0 }}>{p.authors}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-faint)', margin: 0 }}>{p.venue}</p>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer noopener" style={{ color: 'var(--accent)', fontSize: 13 }}>Open paper ↗</a>}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
