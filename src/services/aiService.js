/**
 * AI Tools — heuristic implementations, not a real AI model.
 *
 * There's no backend or API key wired up yet, so these are simple,
 * deterministic, rule-based checks rather than actual machine learning or
 * an LLM call. They're honest placeholders that behave sensibly and are
 * clearly labeled as such in the UI. To make this "real AI", replace the
 * function bodies below with a call to your backend, which would in turn
 * call an LLM API (e.g. the Anthropic API) — something like:
 *
 *   const res = await fetch('/api/ai/resume-review', {
 *     method: 'POST',
 *     body: JSON.stringify({ resumeText, jobDescription }),
 *   })
 *   return res.json()
 *
 * Never call a model API with a secret key directly from the browser —
 * route it through your own backend.
 */

const ATS_KEYWORDS = [
  'experience', 'education', 'skills', 'project', 'certification',
  'github', 'linkedin', 'objective', 'summary', 'contact',
]

export function scoreResume({ hasCV, skills = [], projects = [], certifications = [] }) {
  let score = 0
  const tips = []

  if (hasCV) score += 30
  else tips.push('Upload a CV — an ATS can only score a document, not an empty profile.')

  if (skills.length >= 5) score += 20
  else tips.push(`Add more skills (you have ${skills.length}; aim for at least 5).`)

  if (projects.length >= 2) score += 25
  else tips.push(`List at least 2 projects with a clear tech stack (you have ${projects.length}).`)

  if (certifications.length >= 1) score += 15
  else tips.push('Add at least one certification if you have one — it boosts credibility.')

  if (projects.some((p) => p.github)) score += 10
  else tips.push('Link a GitHub repo to at least one project.')

  return { score: Math.min(score, 100), tips }
}

export function skillGap(studentSkills = [], requiredSkills = []) {
  const have = new Set(studentSkills.map((s) => s.toLowerCase()))
  const missing = requiredSkills.filter((s) => !have.has(s.toLowerCase()))
  const matched = requiredSkills.filter((s) => have.has(s.toLowerCase()))
  const percent = requiredSkills.length ? Math.round((matched.length / requiredSkills.length) * 100) : 0
  return { matched, missing, percent }
}

const ROLE_KEYWORD_MAP = [
  { role: 'Embedded Systems Engineer', keywords: ['embedded', 'firmware', 'microcontroller', 'iot'], skills: ['C', 'C++', 'RTOS', 'ARM', 'I2C/SPI'] },
  { role: 'RF / Telecom Engineer', keywords: ['rf', 'telecom', 'signal', 'antenna', 'satellite'], skills: ['MATLAB', 'RF Design', 'Signal Processing', 'Antenna Theory'] },
  { role: 'VLSI Design Engineer', keywords: ['vlsi', 'chip', 'asic', 'fpga'], skills: ['Verilog', 'VHDL', 'Cadence', 'Digital Design'] },
  { role: 'Network Engineer', keywords: ['network', 'cisco', 'routing', 'cloud'], skills: ['Networking', 'Linux', 'Cloud', 'Cisco/Juniper'] },
  { role: 'Software Engineer', keywords: ['software', 'web', 'app', 'backend', 'frontend'], skills: ['JavaScript', 'Python', 'SQL', 'Git'] },
  { role: 'Data / AI Engineer', keywords: ['ai', 'machine learning', 'data', 'ml'], skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'] },
]

export function suggestRoles(careerInterestText = '') {
  const text = careerInterestText.toLowerCase()
  const matches = ROLE_KEYWORD_MAP.filter((r) => r.keywords.some((k) => text.includes(k)))
  return matches.length ? matches : [ROLE_KEYWORD_MAP[4]] // default: Software Engineer
}
