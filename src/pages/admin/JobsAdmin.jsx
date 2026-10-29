import { useAdmin } from '../../context/AdminContext.jsx'

export default function JobsAdmin() {
  const { jobs, removeJob } = useAdmin()
  return (
    <div>
      <div className="dash-head">
        <h1>Jobs & internships</h1>
        <p>Moderate any live posting on the platform.</p>
      </div>
      {jobs.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No postings yet.</p>}
      {jobs.map((j) => (
        <div className="entry-card" key={j._id}>
          <div className="entry-head">
            <div>
              <div className="entry-title">{j.title}</div>
              <div className="entry-meta">{[j.category, j.company, j.location].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="entry-remove" onClick={() => removeJob(j._id)} aria-label="Remove posting">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
