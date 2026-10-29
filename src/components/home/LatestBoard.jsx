import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal.js'
import useHomeFeed from '../../hooks/useHomeFeed.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

const fmt = (d) => {
  const date = new Date(d)
  return isNaN(date) ? d || '' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}
const shortDept = (dept = '') => (dept.match(/\(([^)]+)\)/) || [])[1] || dept

function Column({ title, to, children, empty, t }) {
  return (
    <div className="board-col">
      <div className="board-col-head">
        <h3>{title}</h3>
        <Link to={to}>{t('board_viewAll')}</Link>
      </div>
      {children.length ? children : <p className="board-empty">{empty}</p>}
    </div>
  )
}

export default function LatestBoard() {
  const { t } = useLanguage()
  const { feed } = useHomeFeed()
  const [ref, visible] = useReveal()

  return (
    <section className="section" id="board">
      <div className="wrap">
        <div className="sec-head">
          <h2>{t('board_title')}</h2>
          {feed.isSample && <p className="sec-desc">{t('board_sample')}</p>}
        </div>

        <div ref={ref} className={`board-grid reveal ${visible ? 'in' : ''}`}>
          <Column title={t('board_circulars')} to="/circulars" empty={t('board_empty')} t={t}>
            {(feed.notices || []).slice(0, 4).map((n) => (
              <Link to="/circulars" className="board-row" key={n._id}>
                <span className="board-main">
                  <b>{n.title.replace(/^(Circular|Notice):\s*/i, '')}</b>
                  <span>{[n.faculty?.name, shortDept(n.faculty?.department)].filter(Boolean).join(' · ')}</span>
                </span>
                <time>{fmt(n.createdAt)}</time>
              </Link>
            ))}
          </Column>

          <Column title={t('board_jobs')} to="/jobs" empty={t('board_empty')} t={t}>
            {(feed.jobs || []).slice(0, 4).map((j) => (
              <Link to="/jobs" className="board-row" key={j._id}>
                <span className="board-main">
                  <b>{j.title}</b>
                  <span>{[j.company, j.location].filter(Boolean).join(' · ')}</span>
                </span>
                <span className={`tag ${j.category === 'Internship' ? 'tag-teal' : ''}`}>{j.category}</span>
              </Link>
            ))}
          </Column>

          <Column title={t('board_events')} to="/events" empty={t('board_empty')} t={t}>
            {(feed.events || []).slice(0, 4).map((e) => (
              <Link to="/events" className="board-row" key={e._id}>
                <span className="board-main">
                  <b>{e.title}</b>
                  <span>{[e.type, e.venue].filter(Boolean).join(' · ')}</span>
                </span>
                <time>{fmt(e.date)}</time>
              </Link>
            ))}
          </Column>
        </div>
      </div>
    </section>
  )
}
