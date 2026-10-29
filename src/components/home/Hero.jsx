import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { SCENES, photoSrc, photoPage } from './HeroScenes.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import useHomeFeed from '../../hooks/useHomeFeed.js'
import { COUNTRY_FLAGS, daysLeft } from '../../data/sampleScholarships.js'

// Optional real photos: src/assets/hero/hero-1.jpg … hero-4.jpg replace the scenes.
const PHOTO_FILES = import.meta.glob('../../assets/hero/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const photoFor = (i) => {
  const hit = Object.entries(PHOTO_FILES).find(([path]) => new RegExp(`hero-${i + 1}\\.`).test(path))
  return hit ? hit[1] : null
}

function Finder() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [tab, setTab] = useState('jobs')
  const [q, setQ] = useState('')

  const TABS = [
    { id: 'jobs', label: t('find_jobs'), to: '/jobs', ph: t('find_ph_jobs') },
    { id: 'study', label: t('find_study'), to: '/study-abroad', ph: t('find_ph_study') },
    { id: 'events', label: t('find_events'), to: '/events', ph: t('find_ph_events') },
  ]
  const current = TABS.find((x) => x.id === tab)

  const submit = (e) => {
    e.preventDefault()
    navigate(`${current.to}${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <form className="finder" onSubmit={submit} role="search" aria-label={t('find_label')}>
      <div className="finder-tabs" role="tablist" aria-label={t('find_label')}>
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            className={tab === x.id ? 'on' : ''}
            onClick={() => setTab(x.id)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <input
        className="finder-input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={current.ph}
        aria-label={current.ph}
      />
      <button type="submit" className="btn btn-primary finder-go">
        {t('find_go')}
      </button>
    </form>
  )
}

export default function Hero() {
  const { t, lang } = useLanguage()
  const { feed } = useHomeFeed()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loaded, setLoaded] = useState({}) // key -> true once a remote photo has loaded
  const [failed, setFailed] = useState({}) // key -> true if it couldn't load

  useEffect(() => {
    if (paused) return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((i) => (i + 1) % SCENES.length), 5500)
    return () => clearInterval(id)
  }, [paused])

  // The scholarship closing soonest (and still open)
  const nextScholarship = [...(feed.scholarships || [])]
    .map((s) => ({ s, d: daysLeft(s.deadline) }))
    .filter((x) => x.d !== null && x.d >= 0)
    .sort((a, b) => a.d - b.d)[0]
  const latestNotice = feed.notices?.[0]

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{t('hero_eyebrow')}</div>
            <h1>{t('hero_headline')}</h1>
            <p className="sub">{t('hero_sub')}</p>
            <div className="hero-ctas">
              <Button to="/register" variant="primary">{t('hero_cta1')}</Button>
              <Button to="/study-abroad" variant="secondary">{t('hero_cta2')}</Button>
            </div>
          </div>

          <div
            className="hero-visual"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="hero-frame">
              {SCENES.map(({ key, Scene, photo }, i) => {
                const local = photoFor(i)
                const remote = photo && !failed[key]
                return (
                  <div key={key} className={`hero-slide ${i === active ? 'on' : ''}`} aria-hidden={i !== active}>
                    {/* illustration sits underneath, so there is never an empty frame while a photo loads */}
                    <Scene />
                    {local && <img src={local} alt="" />}
                    {!local && remote && (
                      <img
                        className={loaded[key] ? 'ready' : ''}
                        src={photoSrc(photo.file, 800)}
                        srcSet={`${photoSrc(photo.file, 480)} 480w, ${photoSrc(photo.file, 800)} 800w, ${photoSrc(photo.file, 1200)} 1200w`}
                        sizes="(max-width: 600px) 92vw, (max-width: 960px) 440px, 500px"
                        style={{ objectPosition: photo.pos }}
                        alt=""
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onLoad={() => setLoaded((l) => ({ ...l, [key]: true }))}
                        onError={() => setFailed((f) => ({ ...f, [key]: true }))}
                      />
                    )}
                  </div>
                )
              })}
              <div className="hero-caption" aria-live="polite">
                <b>{t(SCENES[active].title)}</b>
                <span>{t(SCENES[active].desc)}</span>
              </div>
              <div className="hero-dots">
                {SCENES.map(({ key, title }, i) => (
                  <button
                    key={key}
                    type="button"
                    className={i === active ? 'on' : ''}
                    onClick={() => setActive(i)}
                    aria-label={t(title)}
                    aria-current={i === active}
                  />
                ))}
              </div>
            </div>

            {SCENES[active].photo && loaded[SCENES[active].key] && !photoFor(active) && (
              <p className="hero-credit">
                Photo: {SCENES[active].photo.author} ·{' '}
                <a href={photoPage(SCENES[active].photo.file)} target="_blank" rel="noreferrer">Wikimedia Commons, CC BY-SA 4.0</a>
              </p>
            )}

            {nextScholarship && (
              <Link to="/study-abroad" className="float-card float-a">
                <span className="float-flag" aria-hidden="true">{COUNTRY_FLAGS[nextScholarship.s.country] || '🌍'}</span>
                <span>
                  <b>{nextScholarship.s.title}</b>
                  <em>{nextScholarship.d} {t('float_daysLeft')}</em>
                </span>
              </Link>
            )}
            {latestNotice && (
              <Link to="/circulars" className="float-card float-b">
                <span>
                  <em>{t('float_latestCircular')}</em>
                  <b>{latestNotice.title.replace(/^(Circular|Notice):\s*/i, '')}</b>
                </span>
              </Link>
            )}
          </div>
        </div>

        <Finder key={lang} />
      </div>
    </section>
  )
}
