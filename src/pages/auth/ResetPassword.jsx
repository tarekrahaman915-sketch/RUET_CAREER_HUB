import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h2>Set a new password</h2>
        {done ? (
          <p className="auth-sub">Password updated — redirecting you to sign in…</p>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <Input label="Reset token" value={token} onChange={(e) => setToken(e.target.value)} required />
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            <Button type="submit" variant="primary" block>Update password →</Button>
          </form>
        )}
        <div className="auth-foot">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </main>
  )
}
