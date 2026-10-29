import { useEffect, useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { DEPARTMENTS } from '../../utils/departments.js'
import api from '../../services/apiClient.js'

export default function Profile() {
  const { user, setUser } = useStudent()
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        department: user.department || '',
        studentId: user.studentProfile?.studentId || '',
        semester: user.studentProfile?.semester || '',
        batch: user.studentProfile?.batch || '',
        gpa: user.studentProfile?.gpa || '',
        researchInterest: user.studentProfile?.researchInterest || '',
        careerInterest: user.studentProfile?.careerInterest || '',
      })
    }
  }, [user])

  if (!form) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.patch('/students/me/profile', form)
      setUser(res.user)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Complete profile</h1>
        <p>This is what appears on your public career profile, QR ID card, and generated CV.</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-grid form-row">
          <Input label="Full name" name="name" value={form.name} onChange={onChange} placeholder="Your name" />
          <Input label="Student ID" name="studentId" value={form.studentId} onChange={onChange} placeholder="RUET-2027-041" />
          <label className="ui-field">
            <span className="ui-label">Department</span>
            <select className="ui-input" name="department" value={form.department} onChange={onChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <Input label="Semester" name="semester" value={form.semester} onChange={onChange} placeholder="7th" />
          <Input label="Batch" name="batch" value={form.batch} onChange={onChange} placeholder="2027" />
          <Input label="GPA" name="gpa" value={form.gpa} onChange={onChange} placeholder="3.75" />
        </div>

        <div className="form-row">
          <label className="ui-field">
            <span className="ui-label">Research interest</span>
            <textarea
              className="ui-input"
              name="researchInterest"
              value={form.researchInterest}
              onChange={onChange}
              rows={3}
              placeholder="e.g. Embedded systems, RF design, signal processing"
            />
          </label>
          <label className="ui-field">
            <span className="ui-label">Career interest</span>
            <textarea
              className="ui-input"
              name="careerInterest"
              value={form.careerInterest}
              onChange={onChange}
              rows={3}
              placeholder="e.g. VLSI design roles, telecom network engineering"
            />
          </label>
        </div>

        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile →'}</Button>
        {saved && <span className="mono" style={{ marginLeft: 14, color: 'var(--signal)', fontSize: 13 }}>Saved ✓</span>}
      </form>
    </div>
  )
}
