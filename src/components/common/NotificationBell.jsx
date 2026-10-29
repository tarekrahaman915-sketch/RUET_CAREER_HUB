import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../../services/notificationService.js'

const POLL_MS = 30000

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  const refreshCount = useCallback(async () => {
    try {
      const data = await getUnreadCount()
      setUnreadCount(data.unreadCount)
    } catch {
      // ignore transient polling errors
    }
  }, [])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getNotifications({ limit: 15 })
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // leave previous state on transient errors
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCount()
    const id = setInterval(refreshCount, POLL_MS)
    return () => clearInterval(id)
  }, [refreshCount])

  useEffect(() => {
    if (open) loadList()
  }, [open, loadList])

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleClick(n) {
    if (!n.read) {
      setNotifications((list) => list.map((x) => (x._id === n._id ? { ...x, read: true } : x)))
      setUnreadCount((c) => Math.max(0, c - 1))
      markNotificationRead(n._id).catch(() => {})
    }
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  async function handleDelete(e, id) {
    e.stopPropagation()
    const wasUnread = notifications.find((n) => n._id === id && !n.read)
    setNotifications((list) => list.filter((n) => n._id !== id))
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1))
    deleteNotification(id).catch(() => {})
  }

  async function handleMarkAll() {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    markAllNotificationsRead().catch(() => {})
  }

  return (
    <div className="notif-bell-wrap" ref={boxRef}>
      <button
        className="icon-toggle notif-bell-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        title="Notifications"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-head">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={handleMarkAll}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading && <div className="notif-empty">Loading…</div>}
            {!loading && notifications.length === 0 && (
              <div className="notif-empty">You're all caught up.</div>
            )}
            {!loading &&
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`notif-item ${n.read ? '' : 'unread'}`}
                  onClick={() => handleClick(n)}
                >
                  <div className="notif-item-main">
                    <div className="notif-item-title">{n.title}</div>
                    {n.body && <div className="notif-item-body">{n.body}</div>}
                    <div className="notif-item-time">{timeAgo(n.createdAt)}</div>
                  </div>
                  <button
                    className="notif-item-del"
                    onClick={(e) => handleDelete(e, n._id)}
                    aria-label="Delete notification"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
