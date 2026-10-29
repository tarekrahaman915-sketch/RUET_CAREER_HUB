import { Router } from 'express'
import Mentor from '../models/Mentor.js'
import MentorBooking from '../models/MentorBooking.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { notifyUser } from '../utils/notify.js'

const router = Router()

// Public — students browse mentors before signing in too
router.get('/', async (req, res, next) => {
  try {
    const docs = await Mentor.find().sort({ createdAt: -1 }).populate('alumni', 'profilePicture department status')
    // Keep `alumni` as the plain user id (existing clients rely on it) and
    // add the picture + department so mentor cards can show a face.
    const mentors = docs
      .filter((m) => m.alumni && m.alumni.status === 'Active')
      .map((m) => ({
        ...m.toObject(),
        alumni: m.alumni._id,
        profilePicture: m.alumni.profilePicture || null,
        department: m.alumni.department || '',
      }))
    res.json({ mentors })
  } catch (err) {
    next(err)
  }
})

router.post('/:mentorId/book', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId)
    if (!mentor) return res.status(404).json({ message: 'Mentor not found.' })

    const booking = await MentorBooking.create({
      student: req.user._id,
      mentor: mentor._id,
      studentName: req.user.name,
      mentorName: mentor.name,
      date: req.body.date,
      time: req.body.time,
    })

    notifyUser(mentor.alumni, {
      type: 'Mentorship',
      title: `New booking request from ${req.user.name}`,
      body: `Requested ${req.body.date || ''} ${req.body.time || ''}`.trim(),
      link: '/alumni/mentorship',
    })

    res.status(201).json({ booking })
  } catch (err) {
    next(err)
  }
})

router.get('/me/bookings', requireAuth, requireActive, requireRole('Alumni'), async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ alumni: req.user._id })
    if (!mentor) return res.json({ bookings: [] })
    const bookings = await MentorBooking.find({ mentor: mentor._id }).sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    next(err)
  }
})

router.patch('/bookings/:id/confirm', requireAuth, requireActive, requireRole('Alumni'), async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ alumni: req.user._id })
    if (!mentor) return res.status(403).json({ message: 'You are not listed as a mentor.' })

    const booking = await MentorBooking.findOne({ _id: req.params.id, mentor: mentor._id })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })

    // No real Calendar/Meet API wired up — generates a plausible-looking
    // placeholder link instead of pretending to create a real meeting.
    const code = Math.random().toString(36).slice(2, 5) + '-' + Math.random().toString(36).slice(2, 6)
    booking.status = 'Confirmed'
    booking.meetLink = `https://meet.google.com/${code}`
    await booking.save()

    notifyUser(booking.student, {
      type: 'Mentorship',
      title: `${booking.mentorName} confirmed your session`,
      body: `${booking.date || ''} ${booking.time || ''} — ${booking.meetLink}`.trim(),
      link: '/student/mentorship',
    })

    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

router.patch('/bookings/:id/feedback', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const booking = await MentorBooking.findOne({ _id: req.params.id, student: req.user._id })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })

    booking.feedback = req.body.feedback || ''
    await booking.save()
    res.json({ booking })
  } catch (err) {
    next(err)
  }
})

export default router
