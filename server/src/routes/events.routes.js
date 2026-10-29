import { Router } from 'express'
import Event from '../models/Event.js'
import EventRegistration from '../models/EventRegistration.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'

const router = Router()

// Public — only approved events
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'Approved' }).sort({ createdAt: -1 })
    res.json({ events })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/register', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    const existing = await EventRegistration.findOne({ student: req.user._id, event: event._id })
    if (existing) {
      await existing.deleteOne()
      return res.json({ registered: false })
    }

    await EventRegistration.create({ student: req.user._id, event: event._id })
    res.json({ registered: true })
  } catch (err) {
    next(err)
  }
})

router.get('/me/registrations', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const regs = await EventRegistration.find({ student: req.user._id })
    res.json({ eventIds: regs.map((r) => r.event) })
  } catch (err) {
    next(err)
  }
})

export default router
