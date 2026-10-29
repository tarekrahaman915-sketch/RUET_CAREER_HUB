import { Link, useSearchParams } from 'react-router-dom'
import { CAREER_PATHS, getPath, pathProgress } from '../../data/careerPaths.js'
import useCareerPlan from '../../hooks/useCareerPlan.js'
import { PathWorkspace } from '../public/CareerPathDetail.jsx'
import PathImage from '../../components/common/PathImage.jsx'
import { RUET_RESOURCES } from '../../data/careerResources.js'

/** Student dashboard: the page built around the career path THEY chose. */
export default function CareerPlan() {
  const { plan, choose } = useCareerPlan()
  const [params, setParams] = useSearchParams()
  const chosen = getPath(plan.primary)
  const t = params.get('tab')
  const tab = ['overview', 'guide', 'roadmap', 'resources', 'people'].includes(t) ? t : 'roadmap'

  if (!chosen)
    return (
      <div>
        <div className="dash-head"><h1>My career plan</h1><p>Choose the path you want to follow. This page then becomes your guideline, roadmap and resource list for it, and shows on your public profile.</p></div>
        <div className="career-grid">
          {CAREER_PATHS.map((p) => (
            <article key={p.id} className="career-card">
              <PathImage title={p.wiki} local={p.localImage} icon={p.icon} alt={p.title} height={120} />
              <div className="career-card-link"><h3>{p.icon} {p.title}</h3><p>{p.tagline}</p></div>
              <div className="career-card-foot"><Link to={`/careers/${p.id}`} className="btn btn-ghost btn-sm">Details</Link><button className="btn btn-primary btn-sm" onClick={() => choose(p.id)}>Choose</button></div>
            </article>
          ))}
        </div>
      </div>
    )

  const pr = pathProgress(chosen, plan.progress[chosen.id] || [])
  return (
    <div>
      <div className="dash-head">
        <h1>My career plan</h1>
        <p>You chose <b>{chosen.title}</b> · {pr.pct}% of the roadmap done. <Link to="/careers" style={{ color: 'var(--accent)' }}>Change path</Link></p>
      </div>
      <PathWorkspace path={chosen} tab={tab} setTab={(k) => setParams({ tab: k })} />
      <section className="profile-section" style={{ marginTop: 28 }}>
        <h2>RUET links</h2>
        <div className="res-grid">
          {RUET_RESOURCES.map((r) => (
            <a key={r.url} className="res-card" href={r.url} target="_blank" rel="noreferrer noopener"><span className="res-type">{r.type}</span><b>{r.title} ↗</b><small>{r.provider}</small><p>{r.note}</p></a>
          ))}
        </div>
      </section>
    </div>
  )
}
