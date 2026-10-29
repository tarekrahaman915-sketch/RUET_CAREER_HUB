import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal.jsx'
import Button from './Button.jsx'
import Avatar from './Avatar.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * "Message this person" dialog. Signed-out visitors are asked to sign in;
 * after sending, links straight to the conversation in the inbox.
 */
export default function MessageModal({ person, isOpen, onClose, presets = [] }) {
  const { isSignedIn, user } = useAuth()
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const close = () => {
    setBody('')
    setError('')
    setSent(false)
    onClose()
  }

  const send = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.post(`/messages/to/${person._id}`, { body })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!person) return null
  const isSample = String(person._id).startsWith('sp')
  const isMe = user && String(user._id) === String(person._id)

  return (
    <Modal isOpen={isOpen} onClose={close} title={`Message ${person.name}`}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Avatar person={person} size={44} />
        <div>
          <div style={{ fontWeight: 600 }}>{person.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{[person.role, person.department].filter(Boolean).join(' · ')}</div>
        </div>
      </div>

      {!isSignedIn ? (
        <>
          <p style={{ color: 'var(--text-mute)', fontSize: 14 }}>Sign in to send a message. Only RUET Hub members can message each other.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Button to="/login" variant="primary">Sign in</Button>
            <Button to="/register" variant="secondary">Create profile</Button>
          </div>
        </>
      ) : isMe ? (
        <p style={{ color: 'var(--text-mute)', fontSize: 14 }}>This is you. Pick someone else to message.</p>
      ) : isSample ? (
        <p style={{ color: 'var(--text-mute)', fontSize: 14 }}>This is a fictional sample profile, so messages can't be delivered. Real members will show here once the server has approved accounts.</p>
      ) : sent ? (
        <>
          <p style={{ color: 'var(--success)', fontWeight: 600 }}>Message sent ✓</p>
          <p style={{ color: 'var(--text-mute)', fontSize: 14 }}>{person.name} will see it in their inbox and get a notification.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Button to={`/messages/${person._id}`} variant="primary">Open conversation</Button>
            <Button variant="ghost" onClick={close}>Close</Button>
          </div>
        </>
      ) : (
        <form onSubmit={send}>
          {presets.length > 0 && (
            <div className="entry-tags" style={{ marginBottom: 10 }}>
              {presets.map((p) => (
                <button type="button" key={p} className="preset-chip" onClick={() => setBody(p)}>
                  {p.length > 46 ? `${p.slice(0, 46)}…` : p}
                </button>
              ))}
            </div>
          )}
          <textarea
            className="ui-input"
            rows={5}
            maxLength={2000}
            required
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Introduce yourself and ask ${person.name.split(' ')[0]} a specific question…`}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-faint)', margin: '6px 0 14px' }}>
            <span>Be specific and polite — mentors are volunteering their time.</span>
            <span>{body.length}/2000</span>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <Button type="submit" variant="primary" block loading={busy} disabled={!body.trim()}>Send message</Button>
        </form>
      )}
    </Modal>
  )
}
