import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStudent } from '../../context/StudentContext.jsx'
import { isStudent } from '../../utils/auth.js'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'
import SampleNotice from '../../components/common/SampleNotice.jsx'
import useApiOrSample from '../../hooks/useApiOrSample.js'
import { SAMPLE_JOBS } from '../../data/sampleData.js'

const TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship']
const EXPERIENCES = ['All', 'Entry-level', 'Mid-level', 'Senior-level']

export default function Jobs() {
  const { data: jobs, loading, isSample } = useApiOrSample('/jobs', (d) => d.jobs, SAMPLE_JOBS)
  const { user, setUser, applications, refreshApplications } = useStudent()
  const studentSignedIn = isStudent() && !isSample

  const [params] = useSearchParams()
  const [keyword, setKeyword] = useState(params.get('q') || '')
  const [location, setLocation] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [company, setCompany] = useState('All')
  const [type, setType] = useState('All')
  const [experience, setExperience] = useState('All')


  const companies = useMemo(() => ['All', ...new Set(jobs.map((j) => j.company).filter(Boolean))], [jobs])

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (keyword && !`${job.title} ${job.company} ${job.description}`.toLowerCase().includes(keyword.toLowerCase())) return false
      if (location && !job.location?.toLowerCase().includes(location.toLowerCase())) return false
      if (remoteOnly && !/remote/i.test(job.location || '')) return false
      if (company !== 'All' && job.company !== company) return false
      if (type !== 'All' && job.type !== type) return false
      if (experience !== 'All' && job.experience !== experience) return false
      return true
    })
  }, [jobs, keyword, location, remoteOnly, company, type, experience])

  const applicationFor = (jobId) => applications.find((a) => a.job?._id === jobId)
  const savedJobIds = user?.studentProfile?.savedJobIds || []

  const applyToJob = async (jobId) => {
    await api.post(`/jobs/${jobId}/apply`)
    refreshApplications()
  }

  const toggleSaveJob = async (jobId) => {
    const res = await api.post(`/students/me/save-job/${jobId}`)
    setUser((u) => ({ ...u, studentProfile: { ...u.studentProfile, savedJobIds: res.savedJobIds } }))
  }

  return (
    <main className="page">
      <div className="wrap">
        <div className="sec-tag">Job Portal</div>
        <h1>Open roles for RUET students & alumni.</h1>
        <p className="lead">
          Live postings from companies and alumni.{' '}
          {!studentSignedIn && (
            <>
              <Link to="/login" style={{ color: 'var(--signal)' }}>Sign in as a student</Link> to apply and save jobs.
            </>
          )}
        </p>

        {isSample && <SampleNotice>These are real hiring sources: each card opens the employer’s own careers or recruitment page, where the live vacancies, qualifications and deadlines are published. Jobs posted by companies on this platform appear here with an Apply button.</SampleNotice>}

        <div className="job-filters">
          <input
            className="ui-input"
            style={{ gridColumn: '1 / -1' }}
            placeholder="Search by title, company, or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            className="ui-input"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select className="ui-input" value={company} onChange={(e) => setCompany(e.target.value)}>
            {companies.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All companies' : c}</option>
            ))}
          </select>
          <select className="ui-input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All job types' : t}</option>
            ))}
          </select>
          <select className="ui-input" value={experience} onChange={(e) => setExperience(e.target.value)}>
            {EXPERIENCES.map((e) => (
              <option key={e} value={e}>{e === 'All' ? 'All experience levels' : e}</option>
            ))}
          </select>
          <label className="job-remote-toggle">
            <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
            Remote only
          </label>
        </div>

        {!loading && jobs.length === 0 && (
          <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 30 }}>
            No jobs posted yet — check back once companies and alumni start posting.
          </p>
        )}
        {!loading && jobs.length > 0 && filtered.length === 0 && (
          <p style={{ color: 'var(--text-faint)', fontSize: 13.5, marginTop: 30 }}>No jobs match those filters.</p>
        )}

        <div className="page-grid">
          {filtered.map((job) => {
            const saved = savedJobIds.includes(job._id)
            const application = applicationFor(job._id)
            return (
              <div className="ui-card" key={job._id}>
                <div className="ui-card-title">{job.title}</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: 0 }}>{job.company}</p>
                <div className="entry-tags" style={{ margin: '6px 0' }}>
                  {[job.category === 'Internship' ? 'Internship' : null, job.type !== 'Internship' ? job.type : null, job.duration, job.experience, job.location, job.salary, job.deadline && `Deadline: ${job.deadline}`]
                    .filter(Boolean)
                    .map((t) => (
                      <span className="chip" key={t}>{t}</span>
                    ))}
                </div>
                {job.description && <p className="entry-desc">{job.description}</p>}

                {job.external ? (
                  <Button href={job.link} target="_blank" variant="primary" style={{ marginTop: 10 }}>Open careers page ↗</Button>
                ) : studentSignedIn ? (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                    {application ? (
                      <span className="chip" style={{ color: 'var(--signal)' }}>✓ {application.status}</span>
                    ) : (
                      <Button variant="primary" onClick={() => applyToJob(job._id)}>Apply</Button>
                    )}
                    <Button variant="ghost" onClick={() => toggleSaveJob(job._id)}>
                      {saved ? '★ Saved' : '☆ Save'}
                    </Button>
                  </div>
                ) : isSample ? null : (
                  <Button to="/login" variant="ghost" style={{ marginTop: 10 }}>Sign in to apply</Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
