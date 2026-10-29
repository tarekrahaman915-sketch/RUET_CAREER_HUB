import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { DEPARTMENTS } from '../../utils/departments.js'
import { getCurrentRole, isAuthenticated } from '../../utils/auth.js'
import api, { apiUrl } from '../../services/apiClient.js'
import { Link } from 'react-router-dom'
import { CAREER_PATHS } from '../../data/careerPaths.js'
import { ALL_RESOURCES, RUET_RESOURCES } from '../../data/careerResources.js'


const TYPES = ['All', 'PDF', 'Book', 'Notes', 'Lecture', 'Video', 'Previous Questions']
const UPLOAD_TYPES = ['PDF', 'Book', 'Notes', 'Lecture', 'Video', 'Previous Questions']

export default function Resources() {
  const [type, setType] = useState('All')
  const [department, setDepartment] = useState('All')
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', type: 'PDF', department: '' })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const canUpload = isAuthenticated() && ['Faculty', 'Admin'].includes(getCurrentRole())

  const load = () => api.get('/resources').then((data) => setResources(data.resources)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const all = resources
  const [pathFilter, setPathFilter] = useState('all')
  const [rtype, setRtype] = useState('All')
  const curated = ALL_RESOURCES.filter((r) => (pathFilter === 'all' || r.pathId === pathFilter) && (rtype === 'All' || r.type === rtype))
  const RTYPES = ['All', ...new Set(ALL_RESOURCES.map((r) => r.type))]
  const filtered = all.filter(
    (r) => (type === 'All' || r.type === type) && (department === 'All' || r.department === department)
  )

  const onUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', form.title)
      formData.append('type', form.type)
      formData.append('department', form.department)
      await api.upload('/resources', formData)
      setForm({ title: '', type: 'PDF', department: '' })
      setFile(null)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const onDelete = async (id) => {
    await api.delete(`/resources/${id}`)
    load()
  }

  return (
    <main className="page">
      <div className="wrap">
        <div className="sec-tag">Resource Library</div>
        <h1>Learning resources for every career path.</h1>
        <p className="lead">
          Real courses, official documentation, tools and professional bodies, grouped by career path. Every link opens the publisher’s own site. Files uploaded by faculty are listed further down.
        </p>

        <div className="tab-row" style={{ marginBottom: 10 }}>
          <button className={`tab-btn ${pathFilter === 'all' ? 'on' : ''}`} onClick={() => setPathFilter('all')}>All paths</button>
          {CAREER_PATHS.map((p) => <button key={p.id} className={`tab-btn ${pathFilter === p.id ? 'on' : ''}`} onClick={() => setPathFilter(p.id)}>{p.title.split(',')[0].split(' & ')[0]}</button>)}
        </div>
        <div className="job-filters" style={{ gridTemplateColumns: '1fr', maxWidth: 260 }}>
          <select className="ui-input" value={rtype} onChange={(e) => setRtype(e.target.value)} aria-label="Resource type">
            {RTYPES.map((t) => <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>)}
          </select>
        </div>
        <div className="res-grid" style={{ marginTop: 16 }}>
          {curated.map((r) => (
            <a key={r.pathId + r.url} className="res-card" href={r.url} target="_blank" rel="noreferrer noopener">
              <span className="res-type">{r.type}</span>
              <b>{r.title} ↗</b>
              <small>{r.provider} · {CAREER_PATHS.find((p) => p.id === r.pathId)?.title}</small>
              {r.note && <p>{r.note}</p>}
            </a>
          ))}
        </div>
        <p className="sch-fineprint">Choosing a path? <Link to="/careers" style={{ color: 'var(--accent)' }}>See the career guidelines</Link>. Students get this list personalised under <b>My career plan</b> in their dashboard.</p>

        <h2 style={{ fontSize: 20, marginTop: 40 }}>RUET official links</h2>
        <div className="res-grid" style={{ marginTop: 12 }}>
          {RUET_RESOURCES.map((r) => (
            <a key={r.url} className="res-card" href={r.url} target="_blank" rel="noreferrer noopener"><span className="res-type">{r.type}</span><b>{r.title} ↗</b><small>{r.provider}</small><p>{r.note}</p></a>
          ))}
        </div>

        <h2 style={{ fontSize: 20, marginTop: 40 }}>Files uploaded by faculty</h2>

        {canUpload && (
          <div className="ui-card" style={{ margin: '24px 0' }}>
            <div className="ui-card-title">Upload a resource</div>
            <form onSubmit={onUpload}>
              <div className="form-row">
                <div className="form-grid">
                  <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <label className="ui-field">
                    <span className="ui-label">Type</span>
                    <select className="ui-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      {UPLOAD_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
                <label className="ui-field">
                  <span className="ui-label">Department</span>
                  <select className="ui-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label className="ui-field">
                  <span className="ui-label">File</span>
                  <input className="ui-input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                </label>
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
              <Button type="submit" variant="primary" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload →'}</Button>
            </form>
          </div>
        )}

        <div className="job-filters" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <select className="ui-input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>
            ))}
          </select>
          <select className="ui-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="All">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {!loading && filtered.length === 0 && (
          <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 24 }}>No uploaded files yet. Faculty can upload notes, books and past papers here after signing in.</p>
        )}

        <div className="page-grid">
          {filtered.map((r) => (
            <Card key={r._id || r.title} title={r.title}>
              <span className="chip">{r.type}</span>
              <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: 0 }}>{r.department || 'All departments'}</p>
              {r.sample ? (
                <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 6 }}>Sample entry, no file attached</p>
              ) : (
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <a className="btn btn-ghost" href={apiUrl(`/resources/${r._id}/download`)} target="_blank" rel="noreferrer">
                    Download
                  </a>
                  {canUpload && (
                    <button className="entry-remove" onClick={() => onDelete(r._id)} aria-label="Remove resource">✕</button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
