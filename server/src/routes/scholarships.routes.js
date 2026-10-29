import { Router } from 'express'
import Scholarship from '../models/Scholarship.js'
import ScholarshipTracker from '../models/ScholarshipTracker.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { notifyRole } from '../utils/notify.js'

const router = Router()

// Public — the Study Abroad board
router.get('/', async (req, res, next) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 })
    res.json({ scholarships })
  } catch (err) {
    next(err)
  }
})

// Faculty, alumni (e.g. someone studying abroad) and admins can post opportunities
router.post('/', requireAuth, requireActive, requireRole('Faculty', 'Alumni', 'Admin'), async (req, res, next) => {
  try {
    const { title, country } = req.body
    if (!title || !country) return res.status(400).json({ message: 'Title and country are required.' })

    const scholarship = await Scholarship.create({
      ...req.body,
      postedBy: req.user._id,
      postedByRole: req.user.role,
    })

    notifyRole('Student', {
      type: 'System',
      title: `New scholarship: ${scholarship.title}`,
      body: `${scholarship.country} · ${scholarship.level} · ${scholarship.funding}`,
      link: '/study-abroad',
    })

    res.status(201).json({ scholarship })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requireAuth, requireActive, async (req, res, next) => {
  try {
    const s = await Scholarship.findById(req.params.id)
    if (!s) return res.status(404).json({ message: 'Scholarship not found.' })
    if (!s.postedBy.equals(req.user._id) && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not your posting.' })
    }
    await s.deleteOne()
    await ScholarshipTracker.deleteMany({ scholarship: s._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// ---- Student tracker ----
router.get('/me/tracker', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const items = await ScholarshipTracker.find({ student: req.user._id })
      .populate('scholarship')
      .sort({ updatedAt: -1 })
    res.json({ items: items.filter((i) => i.scholarship) })
  } catch (err) {
    next(err)
  }
})

// Create or update the student's status for a scholarship
router.post('/:id/track', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const s = await Scholarship.findById(req.params.id)
    if (!s) return res.status(404).json({ message: 'Scholarship not found.' })

    const update = {}
    if (req.body.status) update.status = req.body.status
    if (typeof req.body.note === 'string') update.note = req.body.note

    const item = await ScholarshipTracker.findOneAndUpdate(
      { student: req.user._id, scholarship: s._id },
      { $set: update, $setOnInsert: { student: req.user._id, scholarship: s._id } },
      { new: true, upsert: true, runValidators: true }
    )
    res.json({ item })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id/track', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    await ScholarshipTracker.deleteOne({ student: req.user._id, scholarship: req.params.id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

export default router
