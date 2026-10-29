import { Router } from 'express'
import User from '../models/User.js'
import Job from '../models/Job.js'
import Event from '../models/Event.js'
import Project from '../models/Project.js'
import Mentor from '../models/Mentor.js'
import MentorBooking from '../models/MentorBooking.js'
import Report from '../models/Report.js'
import VerificationRequest from '../models/VerificationRequest.js'
import Message from '../models/Message.js'
import VerifiedCompany from '../models/VerifiedCompany.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireActive, requireRole('Admin'))

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email role department status createdAt').sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    next(err)
  }
})

router.patch('/users/:id/status', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

router.get('/verified-companies', async (req, res, next) => {
  try {
    const companies = await VerifiedCompany.find()
    res.json({ companies: companies.map((c) => c.name) })
  } catch (err) {
    next(err)
  }
})

router.post('/verified-companies/:name/toggle', async (req, res, next) => {
  try {
    const name = req.params.name
    const existing = await VerifiedCompany.findOne({ name })
    if (existing) {
      await existing.deleteOne()
      return res.json({ verified: false })
    }
    await VerifiedCompany.create({ name })
    res.json({ verified: true })
  } catch (err) {
    next(err)
  }
})

router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})
router.delete('/jobs/:id', async (req, res, next) => {
  try {
    await Job.deleteOne({ _id: req.params.id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json({ events })
  } catch (err) {
    next(err)
  }
})
router.delete('/events/:id', async (req, res, next) => {
  try {
    await Event.deleteOne({ _id: req.params.id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

router.get('/reports', async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 })
    res.json({ reports })
  } catch (err) {
    next(err)
  }
})
router.patch('/reports/:id/resolve', async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true })
    res.json({ report })
  } catch (err) {
    next(err)
  }
})

router.get('/verification-requests', async (req, res, next) => {
  try {
    const requests = await VerificationRequest.find().sort({ createdAt: -1 })
    res.json({ requests })
  } catch (err) {
    next(err)
  }
})
router.patch('/verification-requests/:id/status', async (req, res, next) => {
  try {
    const request = await VerificationRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    res.json({ request })
  } catch (err) {
    next(err)
  }
})

router.get('/messages', async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json({ messages })
  } catch (err) {
    next(err)
  }
})

router.get('/analytics', async (req, res, next) => {
  try {
    const [jobCount, eventCount, projectCount, mentorCount, bookingCount, userCounts] = await Promise.all([
      Job.countDocuments(),
      Event.countDocuments({ status: 'Approved' }),
      Project.countDocuments({ showcase: true }),
      Mentor.countDocuments(),
      MentorBooking.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ])
    const jobsByCategory = await Job.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])

    res.json({
      jobCount,
      eventCount,
      projectCount,
      mentorCount,
      bookingCount,
      userCounts,
      jobsByCategory,
    })
  } catch (err) {
    next(err)
  }
})

export default router
