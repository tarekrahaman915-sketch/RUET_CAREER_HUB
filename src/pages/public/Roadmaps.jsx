import { Link } from 'react-router-dom'
import { CAREER_PATHS, pathProgress } from '../../data/careerPaths.js'
import useCareerPlan from '../../hooks/useCareerPlan.js'
import PathImage from '../../components/common/PathImage.jsx'

export default function Roadmaps() {
  const { plan } = useCareerPlan()
  // Chosen path first, then paths with progress, then the rest.
  const sorted = [...CAREER_PATHS].sort((a, b) => {
    const score = (p) => (plan.primary === p.id ? 2 : (plan.progress[p.id] || []).length ? 1 : 0)
    return score(b) - score(a)
  })
  return (
    <main className="page">
      <div className="wrap">
        <h1>Learning roadmaps</h1>
        <p className="lead">A step-by-step plan for each career section, from foundation to job hunt. Tick steps off as you finish them.</p>
        <div className="career-grid">
          {sorted.map((p) => {
            const pr = pathProgress(p, plan.progress[p.id] || [])
            return (
              <Link key={p.id} to={`/careers/${p.id}?tab=roadmap`} className={`career-card ${plan.primary === p.id ? 'chosen' : ''}`}>
                <PathImage title={p.wiki} local={p.localImage} icon={p.icon} alt={p.title} height={110} />
                <div className="career-card-link">
                                    <h3>{p.title}</h3>
                  <ol className="mini-phases">{p.roadmap.map((ph) => <li key={ph.id}>{ph.name} <small>{ph.weeks}</small></li>)}</ol>
                </div>
                <div className="career-card-foot" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div className="progress" style={{ marginTop: 0 }}><div style={{ width: `${pr.pct}%` }} /></div>
                  <small>{pr.done}/{pr.total} steps{plan.primary === p.id ? ' · your choice' : ''}</small>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
