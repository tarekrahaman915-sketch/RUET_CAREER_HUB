import { Router } from 'express'
import Job from '../models/Job.js'
import Event from '../models/Event.js'
import Notice from '../models/Notice.js'
import Scholarship from '../models/Scholarship.js'
import User from '../models/User.js'

const router = Router()

// Public home-page feed: the latest circulars (faculty notices), jobs,
// events and scholarships in one request, plus a few live counts.
router.get('/', async (req, res, next) => {
  try {
    const [notices, jobs, events, scholarships, jobCount, scholarshipCount, peopleCount] = await Promise.all([
      Notice.find().populate('faculty', 'name department').sort({ createdAt: -1 }).limit(5),
      Job.find().sort({ createdAt: -1 }).limit(5),
      Event.find({ status: 'Approved' }).sort({ createdAt: -1 }).limit(4),
      Scholarship.find().sort({ createdAt: -1 }).limit(6),
      Job.countDocuments(),
      Scholarship.countDocuments(),
      User.countDocuments({ status: 'Active', role: { $ne: 'Admin' } }),
    ])
    res.json({ notices, jobs, events, scholarships, counts: { jobs: jobCount, scholarships: scholarshipCount, people: peopleCount } })
  } catch (err) {
    next(err)
  }
})

// Public circulars board
router.get('/notices', async (req, res, next) => {
  try {
    const notices = await Notice.find().populate('faculty', 'name department').sort({ createdAt: -1 }).limit(50)
    res.json({ notices })
  } catch (err) {
    next(err)
  }
})

export default router
