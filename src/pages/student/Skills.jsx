import { useStudent } from '../../context/StudentContext.jsx'
import TagInput from '../../components/ui/TagInput.jsx'
import api from '../../services/apiClient.js'

export default function Skills() {
  const { user, setUser } = useStudent()
  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const setSkills = async (skills) => {
    const res = await api.patch('/students/me/skills', { skills })
    setUser(res.user)
  }
  const setLanguages = async (languages) => {
    const res = await api.patch('/students/me/languages', { languages })
    setUser(res.user)
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Skills & languages</h1>
        <p>Used for AI job matching and recruiter skill search.</p>
      </div>

      <div className="form-row">
        <TagInput
          label="Skills"
          value={user.studentProfile?.skills || []}
          onChange={setSkills}
          placeholder="e.g. PCB Design, Signal Processing — press Enter"
        />
        <TagInput
          label="Programming languages"
          value={user.studentProfile?.languages || []}
          onChange={setLanguages}
          placeholder="e.g. Python, C++, MATLAB — press Enter"
        />
      </div>
    </div>
  )
}
