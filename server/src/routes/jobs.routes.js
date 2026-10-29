import { Router } from 'express'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { notifyUser } from '../utils/notify.js'

const router = Router()

// Public — the Job Portal
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})

router.get('/companies', async (req, res, next) => {
  try {
    const companies = await Job.aggregate([
      { $group: { _id: '$company', openRoles: { $sum: 1 } } },
      { $project: { name: '$_id', openRoles: 1, _id: 0 } },
    ])
    res.json({ companies })
  } catch (err) {
    next(err)
  }
})

// Recruiters and alumni can post jobs/internships
router.post('/', requireAuth, requireActive, requireRole('Recruiter', 'Alumni'), async (req, res, next) => {
  try {
    const company =
      req.user.role === 'Recruiter'
        ? req.user.companyProfile.companyName || 'A partner company'
        : req.body.company || 'A partner company'

    const job = await Job.create({
      ...req.body,
      company,
      postedBy: req.user._id,
      postedByRole: req.user.role,
    })
    res.status(201).json({ job })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requireAuth, requireActive, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found.' })

    const isOwner = job.postedBy.equals(req.user._id)
    const isAdmin = req.user.role === 'Admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not your posting.' })

    await job.deleteOne()
    await Application.deleteMany({ job: job._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Students apply
router.post('/:id/apply', requireAuth, requireActive, requireRole('Student'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found.' })

    const existing = await Application.findOne({ student: req.user._id, job: job._id })
    if (existing) return res.status(200).json({ application: existing })

    const application = await Application.create({ student: req.user._id, job: job._id })

    notifyUser(job.postedBy, {
      type: job.category === 'Internship' ? 'Internship' : 'Job',
      title: `New applicant: ${job.title}`,
      body: `${req.user.name} applied to "${job.title}".`,
      link: '/company/applicants',
    })

    res.status(201).json({ application })
  } catch (err) {
    next(err)
  }
})

export default router
