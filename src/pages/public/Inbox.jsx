import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/ui/Avatar.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

const timeLabel = (iso) => {
  const d = new Date(iso)
  const today = new Date()
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

export default function Inbox() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, loading, refresh } = useAuth()
  const [threads, setThreads] = useState(null)
  const [convo, setConvo] = useState(null) // { user, messages }
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  const loadThreads = useCallback(() => api.get('/messages/threads').then((d) => setThreads(d.threads)).catch(() => setThreads([])), [])
  const loadConvo = useCallback(
    (id) =>
      api
        .get(`/messages/with/${id}`)
        .then((d) => { setConvo(d); setError('') })
        .catch((e) => { setConvo(null); setError(e.message) }),
    []
  )

  useEffect(() => { if (user) loadThreads() }, [user, loadThreads])
  useEffect(() => {
    if (!user || !userId) return setConvo(null)
    loadConvo(userId).then(() => { loadThreads(); refresh() })
    const id = setInterval(() => loadConvo(userId), 15000) // simple polling
    return () => clearInterval(id)
  }, [user?._id, userId]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [convo?.messages?.length])

  if (loading) return <main className="page"><div className="wrap"><p className="board-empty">Loading…</p></div></main>
  if (!user) return <Navigate to="/login" replace />

  const send = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSending(true)
    setError('')
    try {
      await api.post(`/messages/to/${userId}`, { body })
      setBody('')
      await loadConvo(userId)
      loadThreads()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page">
      <div className="wrap">
        <h1>Messages</h1>
        <p className="lead">Conversations with students, alumni mentors and faculty.</p>

        <div className={`inbox ${userId ? 'has-convo' : ''}`}>
          <aside className="inbox-list">
            {threads === null && <p className="board-empty" style={{ padding: 16 }}>Loading…</p>}
            {threads?.length === 0 && (
              <div style={{ padding: 18 }}>
                <p className="board-empty" style={{ padding: 0 }}>No conversations yet.</p>
                <Button to="/mentors" variant="secondary">Find an alumni mentor</Button>
              </div>
            )}
            {threads?.map((t) => (
              <Link key={t.user._id} to={`/messages/${t.user._id}`} className={`inbox-row ${t.user._id === userId ? 'active' : ''}`}>
                <Avatar person={t.user} size={42} />
                <div className="inbox-row-main">
                  <div className="inbox-row-top">
                    <b>{t.user.name}</b>
                    <time>{timeLabel(t.lastMessage.createdAt)}</time>
                  </div>
                  <div className="inbox-row-bottom">
                    <span>{t.lastMessage.mine ? 'You: ' : ''}{t.lastMessage.body}</span>
                    {t.unread > 0 && <span className="badge-dot inline">{t.unread}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </aside>

          <section className="inbox-convo">
            {!userId && <div className="inbox-empty"><p>Select a conversation, or start one from a person's profile.</p></div>}
            {userId && !convo && !error && <p className="board-empty" style={{ padding: 20 }}>Loading…</p>}
            {userId && !convo && error && (
              <div className="inbox-empty"><p style={{ color: 'var(--danger)' }}>{error}</p><Button variant="secondary" onClick={() => navigate('/messages')}>Back</Button></div>
            )}
            {convo && (
              <>
                <header className="convo-head">
                  <button className="convo-back" onClick={() => navigate('/messages')} aria-label="Back to conversations">←</button>
                  <Avatar person={convo.user} size={40} />
                  <div>
                    <Link to={`/people/${convo.user._id}`}><b>{convo.user.name}</b></Link>
                    <small>{[convo.user.role, convo.user.department].filter(Boolean).join(' · ')}</small>
                  </div>
                </header>
                <div className="convo-body">
                  {convo.messages.length === 0 && <p className="board-empty">Say hello 👋</p>}
                  {convo.messages.map((m) => {
                    const mine = String(m.from) === String(user._id)
                    return (
                      <div key={m._id} className={`bubble-row ${mine ? 'mine' : ''}`}>
                        <div className="bubble">
                          <p>{m.body}</p>
                          <time>{timeLabel(m.createdAt)}</time>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={endRef} />
                </div>
                <form className="convo-form" onSubmit={send}>
                  <textarea
                    className="ui-input"
                    rows={2}
                    maxLength={2000}
                    placeholder="Write a message…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form.requestSubmit() } }}
                  />
                  <Button type="submit" variant="primary" loading={sending} disabled={!body.trim()}>Send</Button>
                </form>
                {error && <p style={{ color: 'var(--danger)', fontSize: 13, padding: '0 16px 12px' }}>{error}</p>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
