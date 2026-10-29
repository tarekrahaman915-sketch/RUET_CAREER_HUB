import { useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import Input from '../../components/ui/Input.jsx'
import TagInput from '../../components/ui/TagInput.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

const EMPTY = { title: '', description: '', github: '', demo: '' }

export default function Projects() {
  const { projects, refreshProjects } = useStudent()
  const [form, setForm] = useState(EMPTY)
  const [techStack, setTechStack] = useState([])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.post('/students/me/projects', { ...form, techStack })
    setForm(EMPTY)
    setTechStack([])
    refreshProjects()
  }

  const onRemove = async (id) => {
    await api.delete(`/students/me/projects/${id}`)
    refreshProjects()
  }

  const toggleShowcase = async (p) => {
    await api.patch(`/students/me/projects/${p._id}`, { showcase: !p.showcase })
    refreshProjects()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Projects</h1>
        <p>Showcase what you've built — feeds your portfolio and, optionally, the public Research Hub.</p>
      </div>

      {projects.length === 0 && (
        <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginBottom: 20 }}>No projects added yet.</p>
      )}

      {projects.map((p) => (
        <div className="entry-card" key={p._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{p.title}</div>
              {p.techStack?.length > 0 && (
                <div className="entry-tags" style={{ marginTop: 8 }}>
                  {p.techStack.map((t) => (
                    <span className="chip" key={t}>{t}</span>
                  ))}
                </div>
              )}
            </div>
            <button className="entry-remove" onClick={() => onRemove(p._id)} aria-label="Remove project">✕</button>
          </div>
          {p.description && <p className="entry-desc">{p.description}</p>}
          {(p.github || p.demo) && (
            <div className="entry-links">
              {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
            </div>
          )}
          <div style={{ marginTop: 6 }}>
            <Button variant={p.showcase ? 'ghost' : 'primary'} onClick={() => toggleShowcase(p)}>
              {p.showcase ? '✓ Showing in Research Hub' : 'Show in Research Hub'}
            </Button>
          </div>
        </div>
      ))}

      <div className="ui-card" style={{ marginTop: 24 }}>
        <div className="ui-card-title">Add a project</div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={onChange} placeholder="Smart IoT Irrigation System" />
            <label className="ui-field">
              <span className="ui-label">Description</span>
              <textarea
                className="ui-input"
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                placeholder="What it does, your role, and the outcome"
              />
            </label>
            <TagInput label="Tech stack" value={techStack} onChange={setTechStack} placeholder="e.g. ESP32, MQTT — press Enter" />
            <div className="form-grid">
              <Input label="GitHub link" name="github" value={form.github} onChange={onChange} placeholder="https://github.com/..." />
              <Input label="Demo link (optional)" name="demo" value={form.demo} onChange={onChange} placeholder="https://..." />
            </div>
          </div>
          <Button type="submit" variant="primary">Add project →</Button>
        </form>
      </div>
    </div>
  )
}
