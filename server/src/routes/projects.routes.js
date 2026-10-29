import { Router } from 'express'
import Project from '../models/Project.js'

const router = Router()

// Public — Research Hub project showcase
router.get('/showcase', async (req, res, next) => {
  try {
    const projects = await Project.find({ showcase: true })
      .populate('student', 'name department')
      .sort({ createdAt: -1 })
    res.json({ projects })
  } catch (err) {
    next(err)
  }
})

export default router
