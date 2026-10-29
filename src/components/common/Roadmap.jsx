import { useState } from 'react'

/** Phased learning roadmap with tick-off steps and a progress bar. */
export default function Roadmap({ path, done = [], onToggle }) {
  const total = path.roadmap.reduce((n, ph) => n + ph.steps.length, 0)
  const doneCount = path.roadmap.reduce((n, ph) => n + ph.steps.filter((s) => done.includes(s.id)).length, 0)
  const pct = total ? Math.round((doneCount / total) * 100) : 0
  const [open, setOpen] = useState({})

  return (
    <section>
      <div className="roadmap-summary">
        <div style={{ flex: 1 }}>
          <b>{doneCount} of {total} steps complete</b>
          <div className="progress"><div style={{ width: `${pct}%` }} /></div>
        </div>
        <span className="roadmap-pct">{pct}%</span>
      </div>

      <ol className="roadmap">
        {path.roadmap.map((ph, i) => {
          const phDone = ph.steps.filter((s) => done.includes(s.id)).length
          const complete = phDone === ph.steps.length
          return (
            <li key={ph.id} className={`phase ${complete ? 'complete' : ''}`}>
              <div className="phase-dot">{complete ? '✓' : i + 1}</div>
              <div className="phase-body">
                <header>
                  <h3>{ph.name}</h3>
                  <span className="tag tag-amber">{ph.weeks}</span>
                  <small>{phDone}/{ph.steps.length}</small>
                </header>
                <p className="phase-goal">{ph.goal}</p>
                <ul className="steps">
                  {ph.steps.map((s) => {
                    const isDone = done.includes(s.id)
                    const key = `${ph.id}-${s.id}`
                    return (
                      <li key={s.id} className={isDone ? 'done' : ''}>
                        <label>
                          <input type="checkbox" checked={isDone} onChange={() => onToggle(s.id)} />
                          <span className="step-title">{s.title}</span>
                        </label>
                        <button className="step-more" onClick={() => setOpen({ ...open, [key]: !open[key] })} aria-expanded={Boolean(open[key])}>
                          {open[key] ? 'Hide' : 'Details'}
                        </button>
                        {open[key] && (
                          <div className="step-detail">
                            <p>{s.detail}</p>
                            {s.resources.length > 0 && (
                              <div className="entry-links">
                                {s.resources.map((r) => <a key={r.url} href={r.url} target="_blank" rel="noreferrer noopener">{r.label} ↗</a>)}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
