import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'

// Just verifies the token and attaches req.user — doesn't care about
// account status, so a pending/suspended user can still hit GET /me and
// see their own status.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Not signed in.' })

  try {
    const payload = verifyToken(token)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ message: 'Account no longer exists.' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session.' })
  }
}

// Use after requireAuth on any route that should only work for an approved,
// non-suspended account (i.e. everything except GET /me and admin actions
// on the account itself).
export function requireActive(req, res, next) {
  if (req.user.status === 'PendingApproval') {
    return res.status(403).json({ message: 'Your account is still awaiting admin approval.', status: 'PendingApproval' })
  }
  if (req.user.status === 'Suspended') {
    return res.status(403).json({ message: 'Your account has been suspended.', status: 'Suspended' })
  }
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not allowed for this role.' })
    }
    next()
  }
}
