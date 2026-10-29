import { useEffect, useState } from 'react'
import api from '../../services/apiClient.js'
import { SAMPLE_FEED } from '../../data/sampleFeed.js'

const SAMPLE_BODY = {
  n1: 'All 7th-semester students must submit their project proposals to the department office by the end of next week.',
  n2: 'Students applying for scholarships abroad should request recommendation letters at least ten days before the deadline.',
  n3: 'Registration for the one-day industry visit opens on Sunday. Seats are limited to 40.',
}

export default function Circulars() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [sample, setSample] = useState(false)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    api
      .get('/feed/notices')
      .then((d) => {
        if (d.notices?.length) setNotices(d.notices)
        else throw new Error('empty')
      })
      .catch(() => {
        setNotices(SAMPLE_FEED.notices.map((n) => ({ ...n, content: SAMPLE_BODY[n._id] })))
        setSample(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <h1>Circulars and notices</h1>
        <p className="lead">Posted by RUET faculty for students and alumni.</p>
        {sample && <div className="notice-bar">Showing sample circulars. Faculty can post real ones from their dashboard.</div>}
        {!loading && notices.length === 0 && <p className="board-empty">No circulars yet.</p>}

        <div className="circular-list">
          {notices.map((n) => {
            const open = openId === n._id
            return (
              <article className="circular" key={n._id}>
                <button className="circular-head" onClick={() => setOpenId(open ? null : n._id)} aria-expanded={open}>
                  <span>
                    <b>{n.title}</b>
                    <span>
                      {[n.faculty?.name, n.faculty?.department].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <time>{new Date(n.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                </button>
                {open && <p className="circular-body">{n.content || 'No further details were added to this notice.'}</p>}
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
