import { Router } from 'express'
import Event from '../models/Event.js'
import Notice from '../models/Notice.js'
import ResearchOpportunity from '../models/ResearchOpportunity.js'
import RecommendedStudent from '../models/RecommendedStudent.js'
import RecommendedInternship from '../models/RecommendedInternship.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { notifyRole } from '../utils/notify.js'

const router = Router()
router.use(requireAuth, requireActive, requireRole('Faculty'))

// Events — faculty submit + approve/reject their own submissions.
// Approving simply flips Event.status, which is what the public /events
// endpoint filters on — no separate "publish" step needed.
router.get('/me/events', async (req, res, next) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json({ events })
  } catch (err) {
    next(err)
  }
})
router.post('/me/events', async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json({ event })
  } catch (err) {
    next(err)
  }
})
router.patch('/me/events/:id/status', async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status: req.body.status },
      { new: true }
    )
    if (!event) return res.status(404).json({ message: 'Event not found.' })
    res.json({ event })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/events/:id', async (req, res, next) => {
  try {
    await Event.deleteOne({ _id: req.params.id, createdBy: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Notices
router.get('/me/notices', async (req, res, next) => {
  try {
    const notices = await Notice.find({ faculty: req.user._id }).sort({ createdAt: -1 })
    res.json({ notices })
  } catch (err) {
    next(err)
  }
})
router.post('/me/notices', async (req, res, next) => {
  try {
    const notice = await Notice.create({ ...req.body, faculty: req.user._id })

    notifyRole('Student', {
      type: 'Notice',
      title: notice.title,
      body: notice.content?.slice(0, 140) || '',
      link: '/student',
    })

    res.status(201).json({ notice })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/notices/:id', async (req, res, next) => {
  try {
    await Notice.deleteOne({ _id: req.params.id, faculty: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Research opportunities
router.get('/me/research-opportunities', async (req, res, next) => {
  try {
    const opportunities = await ResearchOpportunity.find({ faculty: req.user._id }).sort({ createdAt: -1 })
    res.json({ opportunities })
  } catch (err) {
    next(err)
  }
})
router.post('/me/research-opportunities', async (req, res, next) => {
  try {
    const opportunity = await ResearchOpportunity.create({ ...req.body, faculty: req.user._id })
    res.status(201).json({ opportunity })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/research-opportunities/:id', async (req, res, next) => {
  try {
    await ResearchOpportunity.deleteOne({ _id: req.params.id, faculty: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Recommended students
router.get('/me/recommended-students', async (req, res, next) => {
  try {
    const recommendations = await RecommendedStudent.find({ faculty: req.user._id }).sort({ createdAt: -1 })
    res.json({ recommendations })
  } catch (err) {
    next(err)
  }
})
router.post('/me/recommended-students', async (req, res, next) => {
  try {
    const recommendation = await RecommendedStudent.create({ ...req.body, faculty: req.user._id })
    res.status(201).json({ recommendation })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/recommended-students/:id', async (req, res, next) => {
  try {
    await RecommendedStudent.deleteOne({ _id: req.params.id, faculty: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Recommended internships
router.get('/me/recommended-internships', async (req, res, next) => {
  try {
    const recommendations = await RecommendedInternship.find({ faculty: req.user._id }).sort({ createdAt: -1 })
    res.json({ recommendations })
  } catch (err) {
    next(err)
  }
})
router.post('/me/recommended-internships', async (req, res, next) => {
  try {
    const recommendation = await RecommendedInternship.create({ ...req.body, faculty: req.user._id })
    res.status(201).json({ recommendation })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/recommended-internships/:id', async (req, res, next) => {
  try {
    await RecommendedInternship.deleteOne({ _id: req.params.id, faculty: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

export default router
