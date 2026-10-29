import { Router } from 'express'
import path from 'path'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'
import { streamStudentCV } from '../utils/generateCV.js'
import { notifyUser } from '../utils/notify.js'

const router = Router()
router.use(requireAuth, requireActive, requireRole('Recruiter'))

router.patch('/me/profile', async (req, res, next) => {
  try {
    req.user.companyProfile.companyName = req.body.companyName || ''
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.get('/me/jobs', async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id, category: 'Job' }).sort({ createdAt: -1 })
    res.json({ jobs })
  } catch (err) {
    next(err)
  }
})

router.get('/me/internships', async (req, res, next) => {
  try {
    const internships = await Job.find({ postedBy: req.user._id, category: 'Internship' }).sort({ createdAt: -1 })
    res.json({ internships })
  } catch (err) {
    next(err)
  }
})

router.get('/me/applicants', async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }, '_id')
    const jobIds = jobs.map((j) => j._id)
    const applicants = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name email department studentProfile.documents studentProfile.skills studentProfile.gpa profilePicture')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
    res.json({ applicants })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/applicants/:id/status', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job')
    if (!application || !application.job.postedBy.equals(req.user._id)) {
      return res.status(404).json({ message: 'Applicant not found.' })
    }
    application.status = req.body.status
    await application.save()

    notifyUser(application.student, {
      type: 'Application',
      title: `Application update: ${application.job.title}`,
      body: `Your application is now "${application.status}".`,
      link: '/student/overview',
    })

    res.json({ application })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/applicants/:id/schedule-interview', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job')
    if (!application || !application.job.postedBy.equals(req.user._id)) {
      return res.status(404).json({ message: 'Applicant not found.' })
    }
    application.status = 'Interview scheduled'
    application.interview = req.body
    await application.save()

    notifyUser(application.student, {
      type: 'Application',
      title: `Interview scheduled: ${application.job.title}`,
      body: `${application.interview.date || ''} ${application.interview.time || ''}`.trim(),
      link: '/student/overview',
    })

    res.json({ application })
  } catch (err) {
    next(err)
  }
})

router.get('/me/applicants/:id/cv', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job').populate('student')
    if (!application || !application.job.postedBy.equals(req.user._id)) {
      return res.status(404).json({ message: 'Applicant not found.' })
    }
    const cv = application.student?.studentProfile?.documents?.cv
    if (!cv?.storedAs) return res.status(404).json({ message: 'This applicant has not uploaded a CV.' })

    const filePath = path.resolve('uploads', cv.storedAs)
    res.download(filePath, cv.name)
  } catch (err) {
    next(err)
  }
})

router.get('/me/applicants/:id/generated-cv', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job').populate('student')
    if (!application || !application.job.postedBy.equals(req.user._id)) {
      return res.status(404).json({ message: 'Applicant not found.' })
    }
    await streamStudentCV(application.student, res)
  } catch (err) {
    next(err)
  }
})

export default router
