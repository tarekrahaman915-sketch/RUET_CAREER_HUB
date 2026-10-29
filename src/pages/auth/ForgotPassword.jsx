import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/apiClient.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api.post('/auth/forgot-password', { email })
      setSent(true)
      if (data.devResetToken) setDevToken(data.devResetToken)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h2>Reset your password</h2>
        <p className="auth-sub">
          {sent
            ? "If an account exists for that email, a reset link has been generated."
            : "Enter your university email and we'll generate a reset link."}
        </p>

        {!sent ? (
          <form className="auth-form" onSubmit={onSubmit}>
            <Input
              label="University email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ruet.ac.bd"
              required
            />
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            <Button type="submit" variant="primary" block>Send reset link →</Button>
          </form>
        ) : (
          <div>
            <p style={{ fontSize: 12.5, color: 'var(--text-faint)', marginBottom: 16 }}>
              No real email service is wired up yet, so there's no email to check. For this demo, the reset token
              is shown directly below instead of being emailed — wire up a real email provider before deploying
              this for real users.
            </p>
            {devToken && (
              <Button variant="primary" block onClick={() => navigate(`/reset-password?token=${devToken}`)}>
                Continue to reset password →
              </Button>
            )}
          </div>
        )}

        <div className="auth-foot">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </main>
  )
}
