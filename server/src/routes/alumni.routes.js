import { Router } from 'express'
import Mentor from '../models/Mentor.js'
import CareerTip from '../models/CareerTip.js'
import SuccessStory from '../models/SuccessStory.js'
import Job from '../models/Job.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'

const router = Router()
router.use(requireAuth, requireActive, requireRole('Alumni'))

router.get('/me/postings', async (req, res, next) => {
  try {
    const postings = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 })
    res.json({ postings })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/job-position', async (req, res, next) => {
  try {
    if (req.body.name !== undefined) req.user.name = req.body.name
    req.user.alumniProfile.jobPosition = { ...req.user.alumniProfile.jobPosition, ...req.body }
    await req.user.save()

    // Keep the mentor directory entry (if any) in sync with name/company/position.
    await Mentor.findOneAndUpdate(
      { alumni: req.user._id },
      { name: req.user.name, company: req.user.alumniProfile.jobPosition.company, position: req.user.alumniProfile.jobPosition.position }
    )

    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/mentor', async (req, res, next) => {
  try {
    req.user.alumniProfile.mentor = { ...req.user.alumniProfile.mentor, ...req.body }
    await req.user.save()

    if (req.user.alumniProfile.mentor.isMentor) {
      await Mentor.findOneAndUpdate(
        { alumni: req.user._id },
        {
          alumni: req.user._id,
          name: req.user.name || 'RUET Alumni',
          company: req.user.alumniProfile.jobPosition.company,
          position: req.user.alumniProfile.jobPosition.position,
          bio: req.user.alumniProfile.mentor.bio,
          expertise: req.user.alumniProfile.mentor.expertise,
        },
        { upsert: true }
      )
    } else {
      await Mentor.deleteOne({ alumni: req.user._id })
    }

    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.get('/me/mentor-doc', async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ alumni: req.user._id })
    res.json({ mentor })
  } catch (err) {
    next(err)
  }
})

// Career tips
router.get('/me/career-tips', async (req, res, next) => {
  try {
    const tips = await CareerTip.find({ alumni: req.user._id }).sort({ createdAt: -1 })
    res.json({ tips })
  } catch (err) {
    next(err)
  }
})
router.post('/me/career-tips', async (req, res, next) => {
  try {
    const tip = await CareerTip.create({ ...req.body, alumni: req.user._id })
    res.status(201).json({ tip })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/career-tips/:id', async (req, res, next) => {
  try {
    await CareerTip.deleteOne({ _id: req.params.id, alumni: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Success stories
router.get('/me/success-stories', async (req, res, next) => {
  try {
    const stories = await SuccessStory.find({ alumni: req.user._id }).sort({ createdAt: -1 })
    res.json({ stories })
  } catch (err) {
    next(err)
  }
})
router.post('/me/success-stories', async (req, res, next) => {
  try {
    const story = await SuccessStory.create({ ...req.body, alumni: req.user._id })
    res.status(201).json({ story })
  } catch (err) {
    next(err)
  }
})
router.delete('/me/success-stories/:id', async (req, res, next) => {
  try {
    await SuccessStory.deleteOne({ _id: req.params.id, alumni: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

export default router
