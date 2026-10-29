import { Link } from 'react-router-dom'
import { CAREER_PATHS, getPath, pathProgress } from '../../data/careerPaths.js'
import useCareerPlan from '../../hooks/useCareerPlan.js'
import Button from '../../components/ui/Button.jsx'
import PathImage from '../../components/common/PathImage.jsx'

export default function CareerPaths() {
  const { plan, choose, isSignedIn } = useCareerPlan()
  const chosen = getPath(plan.primary)
  const interests = plan.interests.map(getPath).filter(Boolean)
  const prog = chosen ? pathProgress(chosen, plan.progress[chosen.id] || []) : null

  return (
    <main className="page">
      <div className="wrap">
        <h1>Career paths</h1>
        <p className="lead">Explore what each path really involves — roles, skills, employers — then choose yours and follow its learning roadmap.</p>

        <section className="my-choice">
          {chosen ? (
            <>
              <div className="my-choice-main">
                <span className="mini-label">Your choice</span>
                <h2>{chosen.icon} {chosen.title}</h2>
                <p>{chosen.tagline}</p>
                {interests.length > 0 && (
                  <div className="entry-tags">
                    <span className="mini-label" style={{ alignSelf: 'center' }}>Also interested</span>
                    {interests.map((i) => <Link key={i.id} to={`/careers/${i.id}`} className="tag tag-teal">{i.title}</Link>)}
                  </div>
                )}
              </div>
              <div className="my-choice-side">
                <div className="progress"><div style={{ width: `${prog.pct}%` }} /></div>
                <small>{prog.done} of {prog.total} roadmap steps done ({prog.pct}%)</small>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  <Button to={`/careers/${chosen.id}?tab=roadmap`} variant="primary">Continue roadmap</Button>
                  <Button to={`/careers/${chosen.id}`} variant="secondary">Path details</Button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <span className="mini-label">Your choice</span>
              <h2>Not chosen yet</h2>
              <p>Open any path below and press “Choose this path”. {isSignedIn ? 'It will show on your public profile.' : 'Sign in to save it to your profile; until then it is remembered in this browser.'}</p>
            </div>
          )}
        </section>

        <div className="career-grid">
          {CAREER_PATHS.map((p) => {
            const pr = pathProgress(p, plan.progress[p.id] || [])
            const isChosen = plan.primary === p.id
            return (
              <article key={p.id} className={`career-card ${isChosen ? 'chosen' : ''}`}>
                <Link to={`/careers/${p.id}`} style={{ display: 'block' }} aria-label={p.title}>
                  <PathImage title={p.wiki} local={p.localImage} icon={p.icon} alt={p.title} height={150} />
                </Link>
                <Link to={`/careers/${p.id}`} className="career-card-link">
                                    <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
                  <div className="entry-tags">{p.skills.slice(0, 3).map((s) => <span key={s} className="chip-soft">{s}</span>)}</div>
                </Link>
                <div className="career-card-foot">
                  {pr.done > 0 ? <small>{pr.pct}% of roadmap done</small> : <small>{p.roadmap.reduce((n, ph) => n + ph.steps.length, 0)}-step roadmap</small>}
                  {isChosen ? <span className="tag tag-green">✓ Your choice</span> : <button className="btn btn-secondary btn-sm" onClick={() => choose(p.id)}>Choose</button>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
