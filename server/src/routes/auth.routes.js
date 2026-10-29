import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import { signToken } from '../utils/jwt.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'
import { requireAuth } from '../middleware/auth.js'
import { signupPictureUpload } from '../middleware/upload.js'

const router = Router()

// Accepts JSON or multipart/form-data (so the sign-up form can include an
// optional `picture` image file).
const maybePicture = (req, res, next) =>
  req.is('multipart/form-data')
    ? signupPictureUpload.single('picture')(req, res, (err) => (err ? res.status(400).json({ message: err.message }) : next()))
    : next()

router.post('/register', maybePicture, async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' })
    }
    if (!['Student', 'Alumni', 'Faculty', 'Recruiter'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role for self-registration.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(409).json({ message: 'An account with that email already exists.' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      department: department || '',
      profilePicture: req.file
        ? { name: req.file.originalname, size: req.file.size, type: req.file.mimetype, storedAs: req.file.filename }
        : null,
    })

    const token = signToken(user)
    res.status(201).json({ token, user: sanitizeUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ message: 'Incorrect email or password.' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ message: 'Incorrect email or password.' })

    if (user.status === 'PendingApproval') {
      return res.status(403).json({ message: 'Your account is still awaiting admin approval.', status: 'PendingApproval' })
    }
    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'This account has been suspended.', status: 'Suspended' })
    }

    const token = signToken(user)
    res.json({ token, user: sanitizeUser(user) })
  } catch (err) {
    next(err)
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) })
})

// No real email service is wired up yet, so this generates a reset token and
// returns it directly in the response (clearly marked as a dev-only shortcut)
// instead of silently pretending an email was sent. Replace with a real
// email provider (e.g. Resend, SES) before deploying this for real users.
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: (email || '').toLowerCase() })

    // Always respond the same way whether or not the account exists, so this
    // endpoint can't be used to check which emails are registered.
    if (!user) return res.json({ message: 'If that account exists, a reset link has been sent.' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await PasswordResetToken.create({ user: user._id, token, expiresAt })

    res.json({
      message: 'If that account exists, a reset link has been sent.',
      devResetToken: token, // dev-only — remove once real email sending exists
    })
  } catch (err) {
    next(err)
  }
})

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Token and new password are required.' })

    const record = await PasswordResetToken.findOne({ token })
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'That reset link is invalid or has expired.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(record.user, { passwordHash })
    await PasswordResetToken.deleteOne({ _id: record._id })

    res.json({ message: 'Password updated — you can sign in now.' })
  } catch (err) {
    next(err)
  }
})

export default router
