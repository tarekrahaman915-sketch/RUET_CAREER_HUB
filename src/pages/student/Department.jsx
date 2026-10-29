import { useEffect, useState } from 'react'
import { useStudent } from '../../context/StudentContext.jsx'
import api, { fileUrl } from '../../services/apiClient.js'

function PersonRow({ p }) {
  return (
    <div className="entry-card" key={p._id}>
      <div className="entry-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar-circle" style={{ width: 36, height: 36, fontSize: 13 }}>
            {p.profilePicture ? (
              <img src={fileUrl(p.profilePicture.storedAs)} alt={p.name} />
            ) : (
              <span>{(p.name || '?').slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="entry-title" style={{ fontSize: 14 }}>{p.name}</div>
            <div className="entry-meta">{p.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Department() {
  const { user } = useStudent()
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.department) {
      setLoading(false)
      return
    }
    Promise.all([
      api.get(`/people?role=Student&department=${encodeURIComponent(user.department)}`),
      api.get(`/people?role=Faculty&department=${encodeURIComponent(user.department)}`),
    ]).then(([s, f]) => {
      setStudents(s.people.filter((p) => p._id !== user._id))
      setFaculty(f.people)
      setLoading(false)
    })
  }, [user])

  if (loading) return <p style={{ color: 'var(--text-faint)' }}>Loading…</p>

  if (!user?.department) {
    return (
      <div>
        <div className="dash-head">
          <h1>My department</h1>
          <p>Set your department on your Profile page to see your department community here.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="dash-head">
        <h1>{user.department}</h1>
        <p>Faculty and fellow students in your department.</p>
      </div>

      <div className="dash-head" style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 16 }}>Faculty ({faculty.length})</h1>
      </div>
      {faculty.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13, marginBottom: 20 }}>None listed yet.</p>}
      {faculty.map((p) => <PersonRow p={p} key={p._id} />)}

      <div className="dash-head" style={{ marginTop: 28, marginBottom: 12 }}>
        <h1 style={{ fontSize: 16 }}>Students ({students.length})</h1>
      </div>
      {students.length === 0 && <p style={{ color: 'var(--text-faint)', fontSize: 13 }}>None listed yet.</p>}
      {students.map((p) => <PersonRow p={p} key={p._id} />)}
    </div>
  )
}
