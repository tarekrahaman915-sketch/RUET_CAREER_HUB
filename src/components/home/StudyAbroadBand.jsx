import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import useReveal from '../../hooks/useReveal.js'
import useHomeFeed from '../../hooks/useHomeFeed.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { COUNTRY_FLAGS, daysLeft } from '../../data/sampleScholarships.js'

export function ScholarshipMini({ s }) {
  const d = daysLeft(s.deadline)
  const urgent = d !== null && d <= 21
  return (
    <Link to={`/study-abroad?open=${s._id}`} className="sch-mini">
      <span className="sch-flag" aria-hidden="true">{COUNTRY_FLAGS[s.country] || '🌍'}</span>
      <span className="sch-mini-body">
        <b>{s.title}</b>
        <span>{s.country} · {s.level} · {s.funding}</span>
      </span>
      {d !== null && d >= 0 && <span className={`sch-days ${urgent ? 'urgent' : ''}`}>{d}d</span>}
    </Link>
  )
}

export default function StudyAbroadBand() {
  const { t } = useLanguage()
  const { feed } = useHomeFeed()
  const [ref, visible] = useReveal()

  const closing = [...(feed.scholarships || [])]
    .map((s) => ({ s, d: daysLeft(s.deadline) }))
    .filter((x) => x.d !== null && x.d >= 0)
    .sort((a, b) => a.d - b.d)
    .slice(0, 4)
    .map((x) => x.s)

  const steps = [
    [t('abroad_step1'), t('abroad_step1d')],
    [t('abroad_step2'), t('abroad_step2d')],
    [t('abroad_step3'), t('abroad_step3d')],
    [t('abroad_step4'), t('abroad_step4d')],
  ]

  return (
    <section className="abroad-band" id="study-abroad">
      <div ref={ref} className={`wrap abroad-grid reveal ${visible ? 'in' : ''}`}>
        <div>
          <h2>{t('abroad_title')}</h2>
          <p className="abroad-sub">{t('abroad_sub')}</p>
          <ol className="abroad-steps">
            {steps.map(([title, desc]) => (
              <li key={title}>
                <b>{title}</b>
                <span>{desc}</span>
              </li>
            ))}
          </ol>
          <div className="hero-ctas" style={{ marginTop: 28 }}>
            <Button to="/study-abroad" variant="primary">{t('abroad_all')}</Button>
            <Button to="/login" variant="ghost" className="on-dark">{t('abroad_mentors')}</Button>
          </div>
        </div>

        <div className="abroad-list">
          <div className="abroad-list-head">{t('abroad_closing')}</div>
          {closing.map((s) => (
            <ScholarshipMini key={s._id} s={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
