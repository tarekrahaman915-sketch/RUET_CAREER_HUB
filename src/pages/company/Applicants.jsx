import { useState } from 'react'
import { useCompany } from '../../context/CompanyContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Input from '../../components/ui/Input.jsx'
import api, { downloadAuthenticatedFile, fileUrl } from '../../services/apiClient.js'

const STATUS_COLOR = {
  Applied: 'var(--text-faint)',
  Shortlisted: 'var(--warning)',
  'Interview scheduled': 'var(--info)',
  Accepted: 'var(--success)',
  Rejected: 'var(--danger)',
}

export default function Applicants() {
  const { applicants, refreshApplicants } = useCompany()
  const [modalFor, setModalFor] = useState(null)
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', link: '' })

  const setStatus = async (id, status) => {
    await api.patch(`/company/me/applicants/${id}/status`, { status })
    refreshApplicants()
  }

  const openSchedule = (applicant) => {
    setModalFor(applicant)
    setInterviewForm({ date: '', time: '', link: '' })
  }

  const submitSchedule = async (e) => {
    e.preventDefault()
    await api.patch(`/company/me/applicants/${modalFor._id}/schedule-interview`, interviewForm)
    setModalFor(null)
    refreshApplicants()
  }

  const downloadRealCV = (applicant) => {
    const cv = applicant.student?.studentProfile?.documents?.cv
    if (!cv) return
    downloadAuthenticatedFile(`/company/me/applicants/${applicant._id}/cv`, cv.name)
  }

  const downloadGeneratedCV = (applicant) => {
    downloadAuthenticatedFile(
      `/company/me/applicants/${applicant._id}/generated-cv`,
      `${applicant.student?.name || 'candidate'}_CV.pdf`
    )
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Applicants</h1>
        <p>Review, shortlist, and move candidates through your hiring pipeline.</p>
      </div>

      {applicants.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>No applicants yet.</p>}

      {applicants.map((a) => (
        <div className="entry-card" key={a._id}>
          <div className="entry-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 14 }}>
                {a.student?.profilePicture ? (
                  <img src={fileUrl(a.student.profilePicture.storedAs)} alt={a.student?.name} />
                ) : (
                  <span>{(a.student?.name || '?').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="entry-title">{a.student?.name}</div>
                <div className="entry-meta">
                  {[a.student?.department, a.student?.studentProfile?.gpa && `GPA ${a.student.studentProfile.gpa}`].filter(Boolean).join(' · ')}
                </div>
                <div className="entry-meta">Applied for: {a.job?.title}</div>
              </div>
            </div>
            <span className="mono" style={{ fontSize: 12, color: STATUS_COLOR[a.status] || 'var(--text-faint)' }}>
              ● {a.status}
            </span>
          </div>

          {a.student?.studentProfile?.skills?.length > 0 && (
            <div className="entry-tags">
              {a.student.studentProfile.skills.slice(0, 6).map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
          )}

          {a.interview?.date && (
            <div className="entry-meta">Interview: {a.interview.date} {a.interview.time} {a.interview.link && `· ${a.interview.link}`}</div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {a.student?.studentProfile?.documents?.cv && (
              <Button variant="ghost" onClick={() => downloadRealCV(a)}>Download uploaded CV</Button>
            )}
            <Button variant="ghost" onClick={() => downloadGeneratedCV(a)}>Download generated CV</Button>
            <Button variant="ghost" onClick={() => setStatus(a._id, 'Shortlisted')}>Shortlist</Button>
            <Button variant="ghost" onClick={() => openSchedule(a)}>Schedule interview</Button>
            <Button variant="ghost" onClick={() => setStatus(a._id, 'Accepted')}>Accept</Button>
            <Button variant="ghost" onClick={() => setStatus(a._id, 'Rejected')}>Reject</Button>
          </div>
        </div>
      ))}

      <Modal isOpen={Boolean(modalFor)} onClose={() => setModalFor(null)} title={`Schedule interview — ${modalFor?.student?.name ?? ''}`}>
        <form onSubmit={submitSchedule}>
          <div className="form-row">
            <div className="form-grid">
              <Input
                label="Date"
                value={interviewForm.date}
                onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                placeholder="12 Aug 2026"
              />
              <Input
                label="Time"
                value={interviewForm.time}
                onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                placeholder="3:00 PM"
              />
            </div>
            <Input
              label="Meeting link"
              value={interviewForm.link}
              onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })}
              placeholder="https://meet.google.com/..."
            />
          </div>
          <Button type="submit" variant="primary" block>Confirm interview →</Button>
        </form>
      </Modal>
    </div>
  )
}
