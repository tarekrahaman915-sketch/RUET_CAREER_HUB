import { useAdmin } from '../../context/AdminContext.jsx'
import Button from '../../components/ui/Button.jsx'

export default function CompaniesAdmin() {
  const { jobs, verifiedCompanies, toggleVerifiedCompany } = useAdmin()
  const companies = [...new Set(jobs.map((j) => j.company).filter(Boolean))]

  return (
    <div>
      <div className="dash-head">
        <h1>Companies</h1>
        <p>Companies with at least one live posting on the platform.</p>
      </div>
      {companies.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No companies have posted yet.</p>}
      {companies.map((name) => {
        const verified = verifiedCompanies.includes(name)
        return (
          <div className="entry-card" key={name}>
            <div className="entry-head">
              <div className="entry-title">{name}</div>
              <span className="mono" style={{ fontSize: 12, color: verified ? 'var(--signal)' : 'var(--text-faint)' }}>
                {verified ? '✓ Verified' : 'Unverified'}
              </span>
            </div>
            <Button variant={verified ? 'ghost' : 'primary'} onClick={() => toggleVerifiedCompany(name)}>
              {verified ? 'Remove verification' : 'Verify company'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
