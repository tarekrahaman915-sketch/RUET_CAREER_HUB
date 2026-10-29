import { useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import { scoreResume, skillGap, suggestRoles } from '../../services/aiService.js'
import TagInput from '../../components/ui/TagInput.jsx'

export default function AITools() {
  const { user, projects } = useStudent()
  const [targetSkills, setTargetSkills] = useState(['C++', 'Embedded C', 'RTOS', 'ARM', 'PCB Design'])

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>
  const sp = user.studentProfile || {}

  const resumeResult = scoreResume({
    hasCV: Boolean(sp.documents?.cv),
    skills: sp.skills || [],
    projects,
    certifications: sp.certifications || [],
  })

  const gap = skillGap(sp.skills || [], targetSkills)
  const suggestions = suggestRoles(sp.careerInterest)

  return (
    <div>
      <div className="dash-head">
        <h1>AI tools</h1>
        <p>
          Heuristic, rule-based checks — not a real AI model yet. Honest and useful in the meantime; swap in a real
          LLM-backed API once you're ready (see <code className="mono">src/services/aiService.js</code>).
        </p>
      </div>

      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-title">CV / resume score</div>
        <div className="progress-track" style={{ margin: '14px 0' }}>
          <div className="progress-fill" style={{ width: `${resumeResult.score}%` }} />
        </div>
        <span className="mono" style={{ color: 'var(--signal)', fontSize: 13 }}>{resumeResult.score}/100</span>
        <ul style={{ marginTop: 14, paddingLeft: 18, fontSize: 13.5, color: 'var(--text-mute)' }}>
          {resumeResult.tips.map((tip) => (
            <li key={tip} style={{ marginBottom: 6 }}>{tip}</li>
          ))}
          {resumeResult.tips.length === 0 && <li>Nothing missing — nice work.</li>}
        </ul>
      </div>

      <div className="ui-card" style={{ marginBottom: 20 }}>
        <div className="ui-card-title">Skill gap analysis</div>
        <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: '4px 0 14px' }}>
          Compare your skills against a target role's requirements.
        </p>
        <TagInput label="Target role skills" value={targetSkills} onChange={setTargetSkills} placeholder="Add a required skill" />
        <div className="progress-track" style={{ margin: '14px 0' }}>
          <div className="progress-fill" style={{ width: `${gap.percent}%` }} />
        </div>
        <span className="mono" style={{ color: 'var(--signal)', fontSize: 13 }}>{gap.percent}% match</span>
        {gap.missing.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="ui-label" style={{ marginBottom: 6 }}>Missing skills</div>
            <div className="entry-tags">
              {gap.missing.map((s) => (
                <span className="chip" key={s}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ui-card">
        <div className="ui-card-title">Career suggestion</div>
        <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: '4px 0 14px' }}>
          Based on your career interest field in your profile.
        </p>
        {sp.careerInterest ? (
          <div className="entry-tags">
            {suggestions.map((s) => (
              <span className="chip" key={s.role}>{s.role}</span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
            Add a career interest on your profile to get a suggestion.
          </p>
        )}
      </div>
    </div>
  )
}
