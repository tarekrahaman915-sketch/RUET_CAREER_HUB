import { useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import FileUpload from '../../components/ui/FileUpload.jsx'
import Button from '../../components/ui/Button.jsx'
import api, { fileUrl, downloadAuthenticatedFile } from '../../services/apiClient.js'

export default function Documents() {
  const { user, setUser } = useStudent()
  const [busy, setBusy] = useState('') // 'cv' | 'transcript' | 'picture' | ''
  const [error, setError] = useState('')

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const uploadDoc = async (type, file) => {
    setBusy(type)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.upload(`/students/me/documents/${type}`, formData)
      setUser(res.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const removeDoc = async (type) => {
    setBusy(type)
    try {
      const res = await api.delete(`/students/me/documents/${type}`)
      setUser(res.user)
    } finally {
      setBusy('')
    }
  }

  const uploadPicture = async (file) => {
    setBusy('picture')
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.upload('/profile/picture', formData)
      setUser(res.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const removePicture = async () => {
    setBusy('picture')
    try {
      const res = await api.delete('/profile/picture')
      setUser(res.user)
    } finally {
      setBusy('')
    }
  }

  const downloadCV = () => downloadAuthenticatedFile('/students/me/cv', `${user.name || 'resume'}_CV.pdf`)

  return (
    <div>
      <div className="dash-head">
        <h1>Profile picture, CV & transcript</h1>
        <p>Your profile picture and profile data are combined into an auto-generated, downloadable CV.</p>
      </div>

      <div className="ui-card" style={{ marginBottom: 24 }}>
        <div className="ui-card-title">Profile picture</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
          <div className="avatar-circle">
            {user.profilePicture ? (
              <img src={fileUrl(user.profilePicture.storedAs)} alt={user.name} />
            ) : (
              <span>{(user.name || '?').slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <FileUpload
              file={user.profilePicture}
              onSelect={uploadPicture}
              onRemove={removePicture}
              accept="image/*"
              busy={busy === 'picture'}
            />
          </div>
        </div>
      </div>

      <div className="form-row">
        <FileUpload
          label="Resume / CV"
          file={user.studentProfile?.documents?.cv}
          onSelect={(f) => uploadDoc('cv', f)}
          onRemove={() => removeDoc('cv')}
          accept=".pdf,.doc,.docx"
          busy={busy === 'cv'}
        />
        <FileUpload
          label="Academic transcript"
          file={user.studentProfile?.documents?.transcript}
          onSelect={(f) => uploadDoc('transcript', f)}
          onRemove={() => removeDoc('transcript')}
          accept=".pdf"
          busy={busy === 'transcript'}
        />
      </div>

      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div className="ui-card">
        <div className="ui-card-title">Auto-generated professional CV</div>
        <p style={{ fontSize: 12.5, color: 'var(--text-mute)', margin: '4px 0 14px' }}>
          Built automatically from your profile, picture, skills, projects, and certifications — always up to
          date. This is what recruiters see when they review your applications.
        </p>
        <Button variant="primary" onClick={downloadCV}>Download my generated CV →</Button>
      </div>
    </div>
  )
}
