import useReveal from '../../hooks/useReveal.js'

const ROLES = [
  {
    idx: 'R.01',
    title: 'Student',
    desc: 'Build a living profile that becomes your career record.',
    chips: ['Resume & transcript', 'Skill & portfolio tracker', 'Applied jobs history', 'Career analytics'],
    icon: (
      <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
    ),
  },
  {
    idx: 'R.02',
    title: 'Alumni',
    desc: 'Give back through mentorship, referrals, and hiring.',
    chips: ['Experience timeline', 'Mentorship & AMAs', 'Company referrals', 'Post jobs & internships'],
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c1.5-4 4.5-6 7-6s5.5 2 7 6" /></svg>
    ),
  },
  {
    idx: 'R.03',
    title: 'Faculty',
    desc: 'Guide research groups and vouch for your students.',
    chips: ['Research groups & labs', 'Student evaluation', 'Publication upload', 'Reference letters'],
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7" /><circle cx="19" cy="18" r="2" /></svg>
    ),
  },
  {
    idx: 'R.04',
    title: 'Recruiter',
    desc: 'Search, shortlist, and hire straight from campus.',
    chips: ['Resume & skill search', 'Candidate ranking', 'Interview scheduling', 'Applicant analytics'],
    icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /></svg>
    ),
  },
  {
    idx: 'R.05',
    title: 'Admin',
    desc: 'Keep the whole board verified, safe, and running.',
    chips: ['Verification & moderation', 'Placement reports', 'Access control', 'Audit logs'],
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
    ),
  },
]

const AI_CARDS = [
  {
    title: 'Resume Reviewer & ATS Checker',
    desc: "Scores your resume against real applicant tracking systems and flags what's missing.",
    icon: <svg viewBox="0 0 24 24"><path d="M6 4h9l4 4v12H6z" /><path d="M9 12h6M9 16h6" /></svg>,
  },
  {
    title: 'Skill Gap Analysis & Roadmap',
    desc: 'Compares your profile to your target role and lays out the exact path to close it.',
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>,
  },
  {
    title: 'Mock Interviews',
    desc: 'Voice and video interview practice — technical, HR, behavioral — with instant scoring.',
    icon: <svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="2" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>,
  },
  {
    title: 'Career Prediction & Risk Analysis',
    desc: 'Reads your trajectory against outcomes from students with similar profiles.',
    icon: <svg viewBox="0 0 24 24"><path d="M4 12h4l3-8 4 16 3-8h2" /></svg>,
  },
  {
    title: 'Job & Internship Matching',
    desc: 'Ranks open roles by fit, not just keyword overlap, across jobs and internships alike.',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><path d="M4 20c0-3 3-5 3-5M20 20c0-3-3-5-3-5" /><circle cx="12" cy="16" r="3" /></svg>
    ),
  },
  {
    title: 'Cover Letter & LinkedIn Optimizer',
    desc: 'Drafts company-specific letters and tightens your public profile for recruiters.',
    icon: <svg viewBox="0 0 24 24"><path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7z" /></svg>,
  },
]

const PILLARS = [
  { num: '01', title: 'Job Portal', desc: 'Campus, remote, government, and referral roles with one-click apply.' },
  { num: '02', title: 'Internship Portal', desc: 'Summer, research, and industrial internships with verified certificates.' },
  { num: '03', title: 'Study Abroad', desc: 'Funded scholarships, a personal application tracker, and alumni who already made the move.' },
  { num: '04', title: 'Research Hub', desc: 'Research groups, publications, patents, and lab equipment booking.' },
  { num: '05', title: 'Skill Development', desc: 'Roadmaps for IoT, VLSI, DSP, RF, and cloud — plus coding practice.' },
  { num: '06', title: 'Mentorship', desc: 'Book real sessions with alumni, synced to your calendar.' },
  { num: '07', title: 'Community', desc: 'Department feed, discussion forum, and anonymous Q&A.' },
  { num: '08', title: 'Startup Hub', desc: 'Pitch decks, co-founder search, and investor connect.' },
]

function QRGrid() {
  // Decorative only — not a real scannable code.
  const cells = [
    1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0,
    1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0,
  ]
  return (
    <div className="qr">
      {cells.map((on, i) => (
        <div key={i} className={on ? 'on' : ''} />
      ))}
    </div>
  )
}

export default function Features() {
  const [aiRef, aiVisible] = useReveal()
  const [pillarsRef, pillarsVisible] = useReveal()
  const [idCardRef, idCardVisible] = useReveal()
  const [idListRef, idListVisible] = useReveal()

  return (
    <>
      {/* AI INTELLIGENCE */}
      <section className="section" id="ai">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>AI running underneath every decision.</h2>
            </div>
            <p className="sec-desc">Not a chatbot bolted on top — AI woven into resumes, interviews, and matching.</p>
          </div>

          <div ref={aiRef} className={`ai-grid reveal ${aiVisible ? 'in' : ''}`}>
            {AI_CARDS.map((card) => (
              <div className="ai-card" key={card.title}>
                <div className="ai-icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section className="section" id="pillars">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Everything a career touches, in one place.</h2>
            </div>
            <p className="sec-desc">Eight connected modules, from first internship to a funded PhD.</p>
          </div>

          <div ref={pillarsRef} className={`pillars reveal ${pillarsVisible ? 'in' : ''}`}>
            {PILLARS.map((p) => (
              <div className="pillar" key={p.title}>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIGITAL IDENTITY */}
      <section className="section" id="identity">
        <div className="wrap">
          <div className="identity">
            <div ref={idCardRef} className={`reveal ${idCardVisible ? 'in' : ''}`}>
              <div className="id-card">
                <div className="id-top">
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>RUET-CH / 2026</span>
                  <span className="id-badge">✓ VERIFIED</span>
                </div>
                <div className="id-name">Nusrat Jahan</div>
                <div className="id-role">RUET · Batch 2027</div>
                <QRGrid />
                <div className="id-url">carrierhub.ruet/nusrat.jahan</div>
              </div>
            </div>

            <div ref={idListRef} className={`identity-list reveal ${idListVisible ? 'in' : ''}`}>
              <h2 style={{ marginBottom: 8 }}>One verified profile, wired everywhere.</h2>
              <div className="identity-item">
                <div className="identity-dot" />
                <div>
                  <h4>Verified badges</h4>
                  <p>Student, alumni, faculty, and recruiter accounts are checked before they go live.</p>
                </div>
              </div>
              <div className="identity-item">
                <div className="identity-dot" />
                <div>
                  <h4>QR digital ID card</h4>
                  <p>Scans straight to a public career profile — no app required to view it.</p>
                </div>
              </div>
              <div className="identity-item">
                <div className="identity-dot" />
                <div>
                  <h4>A personal career URL</h4>
                  <p>One link for your resume, transcript, GitHub, and research publications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
