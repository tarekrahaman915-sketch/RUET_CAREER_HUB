import useReveal from '../../hooks/useReveal.js'

const TESTIMONIALS = [
  {
    quote:
      'The AI resume reviewer caught gaps I never noticed, and the mock interviews took the edge off before my first on-site.',
    name: 'A. Rahman',
    role: 'Alumni · Batch 2023',
    initials: 'AR',
  },
  {
    quote:
      'Booking a mentorship session was as easy as picking a slot on a calendar. My mentor referred me to my first internship.',
    name: 'F. Chowdhury',
    role: 'Student · Batch 2026',
    initials: 'FC',
  },
  {
    quote:
      'As a recruiter, the skill search alone cut our shortlisting time in half during campus placement week.',
    name: 'S. Islam',
    role: 'Recruiter · Partner Company',
    initials: 'SI',
  },
]

export default function Testimonials() {
  const [headRef, headVisible] = useReveal()
  const [gridRef, gridVisible] = useReveal()

  return (
    <section className="section">
      <div className="wrap">
        <div ref={headRef} className={`sec-head reveal ${headVisible ? 'in' : ''}`}>
          <div>
            <h2>From people already on the board.</h2>
          </div>
          <p className="sec-desc">Illustrative quotes representing the kind of feedback the platform is built around.</p>
        </div>

        <div ref={gridRef} className={`testimonials-grid reveal ${gridVisible ? 'in' : ''}`}>
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
