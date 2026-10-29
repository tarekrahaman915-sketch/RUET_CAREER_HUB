import { Navigate } from 'react-router-dom'

/**
 * Checks that a JWT exists in localStorage. Doesn't verify the token itself
 * or which role it belongs to — each dashboard's data-loading context calls
 * a real protected endpoint on mount and redirects to /login if that call
 * comes back 401/403 (expired token, wrong role, or a pending/suspended
 * account), so an invalid session still gets caught, just one render later.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('ruet_token'))

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
