import useReveal from '../../hooks/useReveal.js'
import useHomeFeed from '../../hooks/useHomeFeed.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function Statistics() {
  const { t } = useLanguage()
  const { feed } = useHomeFeed()
  const [headRef, headVisible] = useReveal()
  const [statsRef, statsVisible] = useReveal()

  const stats = [
    { value: feed.counts?.people ?? 0, label: t('stats_members') },
    { value: feed.counts?.jobs ?? 0, label: t('stats_jobs') },
    { value: feed.counts?.scholarships ?? 0, label: t('stats_scholarships') },
    { value: 18, label: t('stats_departments') },
  ]

  return (
    <section className="section">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal ${headVisible ? 'in' : ''}`}>
          <h2>{t('stats_title')}</h2>
          {feed.isSample && <p className="sec-desc">{t('board_sample')}</p>}
        </div>

        <div ref={statsRef} className={`stats reveal ${statsVisible ? 'in' : ''}`}>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value.toLocaleString()}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
