import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col">
            <div className="logo" style={{ marginBottom: 14 }}>
              <Logo />
              RUET Carrier HUB
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-mute)', maxWidth: 220 }}>
              {t('footer_tagline')}
            </p>
          </div>
          <div className="foot-col">
            <h5>{t('footer_portals')}</h5>
            <Link to="/register">{t('footer_student')}</Link>
            <Link to="/register">{t('footer_alumni')}</Link>
            <Link to="/register">{t('footer_faculty')}</Link>
            <Link to="/register">{t('footer_recruiter')}</Link>
          </div>
          <div className="foot-col">
            <h5>{t('footer_platform')}</h5>
            <Link to="/jobs">{t('footer_jobPortal')}</Link>
            <Link to="/research">{t('footer_researchHub')}</Link>
            <Link to="/register">{t('footer_mentorship')}</Link>
            <Link to="/register">{t('footer_aiTools')}</Link>
          </div>
          <div className="foot-col">
            <h5>{t('footer_resources')}</h5>
            <Link to="/resources">{t('footer_resourceLibrary')}</Link>
            <Link to="/companies">{t('footer_companyDirectory')}</Link>
            <Link to="/study-abroad">{t('nav_studyAbroad')}</Link>
            <Link to="/circulars">{t('footer_circulars')}</Link>
            <Link to="/events">{t('footer_events')}</Link>
          </div>
          <div className="foot-col">
            <h5>{t('footer_department')}</h5>
            <Link to="/about">{t('footer_aboutRuet')}</Link>
            <Link to="/about">{t('footer_contact')}</Link>
            <Link to="/login">{t('footer_adminLogin')}</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t('footer_copyright')}</span>
          <span>{t('footer_tagline2')}</span>
        </div>
      </div>
    </footer>
  )
}
