import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import ProfilePicturePicker from '../../components/ui/ProfilePicturePicker.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

/** Headline, bio, contact links and photo — what shows on /people/:id. */
export default function PublicProfileEditor() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ headline: '', bio: '', linkedin: '', github: '', website: '', phone: '' })
  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setForm({
      headline: user.headline || '',
      bio: user.bio || '',
      linkedin: user.contactLinks?.linkedin || user.studentProfile?.portfolio?.linkedin || '',
      github: user.contactLinks?.github || user.studentProfile?.portfolio?.github || '',
      website: user.contactLinks?.website || user.studentProfile?.portfolio?.website || '',
      phone: user.contactLinks?.phone || '',
    })
  }, [user?._id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const saveAbout = async (e) => {
    e.preventDefault()
    setBusy('about'); setError(''); setMsg('')
    try {
      const { headline, bio, ...contactLinks } = form
      const res = await api.patch('/profile/about', { headline, bio, contactLinks })
      setUser(res.user)
      setMsg('Saved. Your public profile is updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const savePhoto = async () => {
    if (!photo) return
    setBusy('photo'); setError(''); setMsg('')
    try {
      const fd = new FormData()
      fd.append('file', photo)
      const res = await api.upload('/profile/picture', fd)
      setUser(res.user)
      setPhoto(null)
      setMsg('Profile picture updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const removePhoto = async () => {
    setBusy('photo')
    try {
      const res = await api.delete('/profile/picture')
      setUser(res.user)
    } finally {
      setBusy('')
    }
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Public profile</h1>
        <p>
          This is what other members see in the People directory.{' '}
          <Link to={`/people/${user._id}`} style={{ color: 'var(--accent)' }}>View my public profile →</Link>
        </p>
      </div>

      <div className="entry-card" style={{ maxWidth: 640 }}>
        <div className="entry-title">Profile picture</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Avatar person={user} size={72} />
          {user.profilePicture && <Button variant="ghost" onClick={removePhoto} loading={busy === 'photo'}>Remove current</Button>}
        </div>
        <ProfilePicturePicker file={photo} onChange={setPhoto} label="Choose a new photo" />
        {photo && <Button variant="primary" onClick={savePhoto} loading={busy === 'photo'}>Upload photo</Button>}
      </div>

      <form className="entry-card" style={{ maxWidth: 640 }} onSubmit={saveAbout}>
        <div className="entry-title">About & contact</div>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <Input label="Headline" name="headline" value={form.headline} onChange={set} placeholder="e.g. CSE student · embedded ML" hint="One line under your name (max 140 characters)" />
          <label className="ui-field">
            <span className="ui-label">Bio</span>
            <textarea className="ui-input" name="bio" rows={5} maxLength={1200} value={form.bio} onChange={set} placeholder="What are you working on? What are you looking for?" />
          </label>
          <div className="form-grid">
            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={set} placeholder="linkedin.com/in/…" />
            <Input label="GitHub" name="github" value={form.github} onChange={set} placeholder="github.com/…" />
          </div>
          <div className="form-grid">
            <Input label="Website / portfolio" name="website" value={form.website} onChange={set} placeholder="https://…" />
            <Input label="Phone (signed-in members only)" name="phone" value={form.phone} onChange={set} placeholder="+880…" />
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--text-faint)', margin: 0 }}>Your email is only visible to signed-in members, never to anonymous visitors.</p>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
        {msg && <p style={{ color: 'var(--success)', fontSize: 13 }}>{msg}</p>}
        <Button type="submit" variant="primary" loading={busy === 'about'}>Save profile</Button>
      </form>
    </div>
  )
}
