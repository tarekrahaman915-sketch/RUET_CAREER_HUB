import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import PublicationList from '../../components/common/PublicationList.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

const TYPES = ['Journal', 'Conference', 'Thesis', 'Preprint', 'Book chapter', 'Patent', 'Other']
const EMPTY = { title: '', authors: '', venue: '', year: '', link: '', type: 'Conference' }

export default function Publications() {
  const { user, setUser } = useAuth()
  const [editing, setEditing] = useState(null) // null | 'new' | publication
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!user) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  const open = (pub) => {
    setError('')
    setEditing(pub || 'new')
    setForm(pub ? { title: pub.title, authors: pub.authors || '', venue: pub.venue || '', year: pub.year || '', link: pub.link || '', type: pub.type || 'Other' } : EMPTY)
  }
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = editing === 'new' ? await api.post('/profile/publications', form) : await api.patch(`/profile/publications/${editing._id}`, form)
      setUser(res.user)
      setEditing(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (pub) => {
    if (!window.confirm(`Remove "${pub.title}"?`)) return
    const res = await api.delete(`/profile/publications/${pub._id}`)
    setUser(res.user)
  }

  return (
    <div>
      <div className="dash-head" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1>Publications</h1>
          <p>Papers, theses and preprints. Each one shows on your public profile with a clickable link.</p>
        </div>
        <Button variant="primary" onClick={() => open()}>+ Add publication</Button>
      </div>

      <PublicationList publications={user.publications} onEdit={open} onRemove={remove} empty="You haven't added any publications yet. Add your thesis, a conference paper or a preprint with its link." />

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add publication' : 'Edit publication'} wide>
        <form onSubmit={save}>
          <div className="form-row">
            <Input label="Title" name="title" value={form.title} onChange={set} required placeholder="Paper or thesis title" />
            <Input label="Authors" name="authors" value={form.authors} onChange={set} placeholder="A. Rahman, S. Islam" />
            <div className="form-grid">
              <Input label="Journal / conference" name="venue" value={form.venue} onChange={set} placeholder="IEEE Access" />
              <Input label="Year" name="year" value={form.year} onChange={set} placeholder="2026" />
            </div>
            <div className="form-grid">
              <label className="ui-field">
                <span className="ui-label">Type</span>
                <select className="ui-input" name="type" value={form.type} onChange={set}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <Input label="Link (DOI or URL)" name="link" value={form.link} onChange={set} placeholder="https://doi.org/…" hint="Opens in a new tab on your profile" />
            </div>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <Button type="submit" variant="primary" block loading={busy}>{editing === 'new' ? 'Add publication' : 'Save changes'}</Button>
        </form>
      </Modal>
    </div>
  )
}
