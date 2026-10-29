import Hero from '../../components/home/Hero.jsx'
import Features from '../../components/home/Features.jsx'
import CompanySlider from '../../components/home/CompanySlider.jsx'
import StudyAbroadBand from '../../components/home/StudyAbroadBand.jsx'
import LatestBoard from '../../components/home/LatestBoard.jsx'
import Statistics from '../../components/home/Statistics.jsx'
import Testimonials from '../../components/home/Testimonials.jsx'
import Button from '../../components/ui/Button.jsx'
import useReveal from '../../hooks/useReveal.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

function CTABand() {
  const { t } = useLanguage()
  const [ref, visible] = useReveal()
  return (
    <section className="section cta-band">
      <div className="wrap">
        <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>
          <h2>{t('cta_title')}</h2>
          <div className="hero-ctas">
            <Button to="/register" variant="primary">{t('cta_primary')}</Button>
            <Button to="/register" variant="secondary">{t('cta_secondary')}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanySlider />
      <StudyAbroadBand />
      <LatestBoard />
      <Features />
      <Statistics />
      <Testimonials />
      <CTABand />
    </main>
  )
}
