import { Router } from 'express'
import path from 'path'
import Project from '../models/Project.js'
import Application from '../models/Application.js'
import MentorBooking from '../models/MentorBooking.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'
import { streamStudentCV } from '../utils/generateCV.js'

const router = Router()
router.use(requireAuth, requireActive, requireRole('Student'))

router.patch('/me/profile', async (req, res, next) => {
  try {
    const fields = ['name', 'department', 'studentId', 'semester', 'batch', 'gpa', 'researchInterest', 'careerInterest']
    for (const key of fields) {
      if (key === 'name') {
        if (req.body.name !== undefined) req.user.name = req.body.name
        continue
      }
      if (key === 'department') {
        if (req.body.department !== undefined) req.user.department = req.body.department
        continue
      }
      if (req.body[key] !== undefined) req.user.studentProfile[key] = req.body[key]
    }
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/skills', async (req, res, next) => {
  try {
    req.user.studentProfile.skills = req.body.skills || []
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/languages', async (req, res, next) => {
  try {
    req.user.studentProfile.languages = req.body.languages || []
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/portfolio', async (req, res, next) => {
  try {
    req.user.studentProfile.portfolio = { ...req.user.studentProfile.portfolio, ...req.body }
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// Documents — real file upload, saved to server/uploads
router.post('/me/documents/:type', upload.single('file'), async (req, res, next) => {
  try {
    const { type } = req.params
    if (!['cv', 'transcript'].includes(type)) return res.status(400).json({ message: 'Invalid document type.' })
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })

    req.user.studentProfile.documents[type] = {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      storedAs: req.file.filename,
    }
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.delete('/me/documents/:type', async (req, res, next) => {
  try {
    const { type } = req.params
    if (!['cv', 'transcript'].includes(type)) return res.status(400).json({ message: 'Invalid document type.' })
    req.user.studentProfile.documents[type] = null
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// Certifications
router.post('/me/certifications', async (req, res, next) => {
  try {
    req.user.studentProfile.certifications.push(req.body)
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.delete('/me/certifications/:certId', async (req, res, next) => {
  try {
    req.user.studentProfile.certifications = req.user.studentProfile.certifications.filter(
      (c) => c._id.toString() !== req.params.certId
    )
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// Projects
router.get('/me/projects', async (req, res, next) => {
  try {
    const projects = await Project.find({ student: req.user._id }).sort({ createdAt: -1 })
    res.json({ projects })
  } catch (err) {
    next(err)
  }
})

router.post('/me/projects', async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, student: req.user._id })
    res.status(201).json({ project })
  } catch (err) {
    next(err)
  }
})

router.patch('/me/projects/:id', async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, student: req.user._id },
      req.body,
      { new: true }
    )
    if (!project) return res.status(404).json({ message: 'Project not found.' })
    res.json({ project })
  } catch (err) {
    next(err)
  }
})

router.delete('/me/projects/:id', async (req, res, next) => {
  try {
    await Project.deleteOne({ _id: req.params.id, student: req.user._id })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

// Saved jobs
router.post('/me/save-job/:jobId', async (req, res, next) => {
  try {
    const jobId = req.params.jobId
    const ids = req.user.studentProfile.savedJobIds
    const idx = ids.findIndex((id) => id.toString() === jobId)
    if (idx >= 0) ids.splice(idx, 1)
    else ids.push(jobId)
    await req.user.save()
    res.json({ savedJobIds: req.user.studentProfile.savedJobIds })
  } catch (err) {
    next(err)
  }
})

router.get('/me/applications', async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id }).populate('job')
    res.json({ applications })
  } catch (err) {
    next(err)
  }
})

router.get('/me/mentor-bookings', async (req, res, next) => {
  try {
    const bookings = await MentorBooking.find({ student: req.user._id }).sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    next(err)
  }
})

router.get('/me/cv', async (req, res, next) => {
  try {
    await streamStudentCV(req.user, res)
  } catch (err) {
    next(err)
  }
})

export default router
