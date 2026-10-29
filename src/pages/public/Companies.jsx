import { useMemo, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import useApiOrSample from '../../hooks/useApiOrSample.js'
import { SAMPLE_COMPANIES, SAMPLE_JOBS } from '../../data/sampleData.js'

export default function Companies() {
  const { data: jobs, loading, isSample } = useApiOrSample('/jobs', (d) => d.jobs, SAMPLE_JOBS)
  const [q, setQ] = useState('')

  const statsByCompany = useMemo(() => {
    const stats = {}
    jobs.forEach((j) => {
      if (!stats[j.company]) stats[j.company] = { jobs: 0, internships: 0 }
      if (j.category === 'Internship') stats[j.company].internships += 1
      else stats[j.company].jobs += 1
    })
    return stats
  }, [jobs])

  const companies = useMemo(() => {
    const known = new Map(SAMPLE_COMPANIES.map((c) => [c.name, c]))
    const fromJobs = Object.keys(statsByCompany).map((name) => known.get(name) || { name, domain: 'Hiring on RUET Carrier HUB' })
    const rest = SAMPLE_COMPANIES.filter((c) => !statsByCompany[c.name])
    const all = [...fromJobs, ...rest]
    const needle = q.trim().toLowerCase()
    return needle ? all.filter((c) => `${c.name} ${c.domain} ${c.location || ''}`.toLowerCase().includes(needle)) : all
  }, [statsByCompany, q])

  return (
    <main className="page">
      <div className="wrap">
        <h1>Companies hiring RUET talent</h1>
        <p className="lead">Companies with open roles show a count of jobs and internships. Listed companies and public bodies are real; open each website for current vacancies.</p>
        

        <input className="ui-input" style={{ marginTop: 24, maxWidth: 420 }} placeholder="Search by company, field or city" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search companies" />

        {!loading && (
          <div className="page-grid">
            {companies.map((c) => {
              const stats = statsByCompany[c.name]
              const total = stats ? stats.jobs + stats.internships : 0
              return (
                <Card key={c.name} title={c.name}>
                  <p style={{ fontSize: 13.5, color: 'var(--text-mute)', margin: 0 }}>
                    {[c.domain, c.location].filter(Boolean).join(' · ')}
                  </p>
                  {c.about && <p className="entry-desc">{c.about}</p>}
                  <div className="entry-tags" style={{ marginTop: 6 }}>
                    {c.size && c.size !== '—' && <span className="chip">{c.size} staff</span>}
                    {stats?.jobs > 0 && <span className="tag">{stats.jobs} job{stats.jobs > 1 ? 's' : ''}</span>}
                    {stats?.internships > 0 && <span className="tag tag-teal">{stats.internships} internship{stats.internships > 1 ? 's' : ''}</span>}
                  </div>
                  {c.website && <Button href={c.website} target="_blank" variant="secondary" style={{ marginTop: 10 }}>Official site ↗</Button>}
                  {total > 0 && <Button to={`/jobs?q=${encodeURIComponent(c.name)}`} variant="ghost" style={{ marginTop: 10, marginLeft: 8 }}>View roles</Button>}
                </Card>
              )
            })}
          </div>
        )}
        {!loading && companies.length === 0 && <p className="board-empty">No companies match that search.</p>}
      </div>
    </main>
  )
}
