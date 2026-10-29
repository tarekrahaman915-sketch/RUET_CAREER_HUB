import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Mentor from '../models/Mentor.js'
import { verifyToken } from '../utils/jwt.js'

const router = Router()

// Works for visitors too, but if a valid token is sent we know the viewer is
// signed in — which is what unlocks a person's email address.
async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      const payload = verifyToken(token)
      const user = await User.findById(payload.id, '_id status')
      if (user && user.status === 'Active') req.viewer = user
    } catch {
      // bad/expired token = treat as a visitor
    }
  }
  next()
}

const LIST_FIELDS =
  'name role department profilePicture headline bio contactLinks careerPath publications ' +
  'studentProfile.researchInterest studentProfile.careerInterest studentProfile.skills studentProfile.portfolio studentProfile.batch ' +
  'alumniProfile.jobPosition alumniProfile.mentor'

// Public People Directory — only approved (Active) accounts, and only
// public-appropriate fields. Email is added only for signed-in viewers.
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { role, department } = req.query
    const filter = { status: 'Active', role: { $in: ['Student', 'Alumni', 'Faculty'] } }
    if (role && role !== 'All') filter.role = role
    if (department && department !== 'All') filter.department = department

    const fields = req.viewer ? `${LIST_FIELDS} email` : LIST_FIELDS
    const users = await User.find(filter, fields).sort({ createdAt: -1 })

    res.json({ people: users, viewerSignedIn: Boolean(req.viewer) })
  } catch (err) {
    next(err)
  }
})

// One full public profile: portfolio, projects, publications, career path.
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: 'Profile not found.' })
    const fields = req.viewer ? `${LIST_FIELDS} email studentProfile.certifications studentProfile.languages roadmapProgress` : `${LIST_FIELDS} studentProfile.certifications studentProfile.languages roadmapProgress`
    const person = await User.findOne({ _id: req.params.id, status: 'Active', role: { $in: ['Student', 'Alumni', 'Faculty'] } }, fields)
    if (!person) return res.status(404).json({ message: 'Profile not found.' })

    const [projects, mentor] = await Promise.all([
      person.role === 'Student' ? Project.find({ student: person._id, showcase: true }).sort({ createdAt: -1 }) : [],
      person.role === 'Alumni' ? Mentor.findOne({ alumni: person._id }) : null,
    ])

    res.json({ person, projects, mentorId: mentor?._id || null, viewerSignedIn: Boolean(req.viewer) })
  } catch (err) {
    next(err)
  }
})

export default router
