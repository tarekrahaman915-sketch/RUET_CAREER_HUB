import { Router } from 'express'
import { requireAuth, requireActive } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'

const router = Router()
router.use(requireAuth, requireActive)

router.post('/picture', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded.' })
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Profile picture must be an image file.' })
    }

    req.user.profilePicture = {
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

router.delete('/picture', async (req, res, next) => {
  try {
    req.user.profilePicture = null
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max)
const cleanUrl = (v) => {
  const raw = clean(v, 500)
  if (!raw) return ''
  // Only http(s) links are ever stored, so a profile can't carry javascript: URLs.
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const u = new URL(withProto)
    return ['http:', 'https:'].includes(u.protocol) ? u.toString() : ''
  } catch {
    return ''
  }
}

// Headline, bio and contact links — shown on the public profile for every role.
router.patch('/about', async (req, res, next) => {
  try {
    const { headline, bio, contactLinks } = req.body
    if (headline !== undefined) req.user.headline = clean(headline, 140)
    if (bio !== undefined) req.user.bio = clean(bio, 1200)
    if (contactLinks) {
      const c = req.user.contactLinks || {}
      req.user.contactLinks = {
        linkedin: contactLinks.linkedin !== undefined ? cleanUrl(contactLinks.linkedin) : c.linkedin,
        github: contactLinks.github !== undefined ? cleanUrl(contactLinks.github) : c.github,
        website: contactLinks.website !== undefined ? cleanUrl(contactLinks.website) : c.website,
        phone: contactLinks.phone !== undefined ? clean(contactLinks.phone, 30) : c.phone,
      }
    }
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// ---- Publications (Student / Alumni / Faculty) ----
const PUB_TYPES = ['Journal', 'Conference', 'Thesis', 'Preprint', 'Book chapter', 'Patent', 'Other']
const toPublication = (b) => ({
  title: clean(b.title, 300),
  authors: clean(b.authors, 300),
  venue: clean(b.venue, 200),
  year: clean(b.year, 4),
  link: cleanUrl(b.link),
  type: PUB_TYPES.includes(b.type) ? b.type : 'Other',
})

router.post('/publications', async (req, res, next) => {
  try {
    const pub = toPublication(req.body)
    if (!pub.title) return res.status(400).json({ message: 'A publication needs a title.' })
    req.user.publications.push(pub)
    await req.user.save()
    res.status(201).json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.patch('/publications/:id', async (req, res, next) => {
  try {
    const pub = req.user.publications.id(req.params.id)
    if (!pub) return res.status(404).json({ message: 'Publication not found.' })
    const next_ = toPublication({ ...pub.toObject(), ...req.body })
    if (!next_.title) return res.status(400).json({ message: 'A publication needs a title.' })
    pub.set(next_)
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

router.delete('/publications/:id', async (req, res, next) => {
  try {
    const pub = req.user.publications.id(req.params.id)
    if (!pub) return res.status(404).json({ message: 'Publication not found.' })
    pub.deleteOne()
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// ---- Career path choice + learning-roadmap progress (students only) ----
const studentOnly = (req, res, next) =>
  req.user.role === 'Student' ? next() : res.status(403).json({ message: 'Career paths and roadmaps are for student accounts.' })
router.patch('/career-path', studentOnly, async (req, res, next) => {
  try {
    const { primary, interests } = req.body
    const cp = req.user.careerPath || { primary: '', interests: [] }
    if (primary !== undefined) cp.primary = clean(primary, 60)
    if (Array.isArray(interests)) cp.interests = [...new Set(interests.map((i) => clean(i, 60)).filter(Boolean))].slice(0, 8)
    req.user.careerPath = cp
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

// body: { pathId: 'software', steps: ['s1-1', 's1-2', ...] }  (the full ticked list for that path)
router.patch('/roadmap-progress', studentOnly, async (req, res, next) => {
  try {
    const pathId = clean(req.body.pathId, 60)
    if (!pathId || !Array.isArray(req.body.steps)) return res.status(400).json({ message: 'pathId and steps are required.' })
    const steps = [...new Set(req.body.steps.map((x) => clean(x, 40)).filter(Boolean))].slice(0, 200)
    req.user.roadmapProgress = { ...(req.user.roadmapProgress || {}), [pathId]: steps }
    req.user.markModified('roadmapProgress')
    await req.user.save()
    res.json({ user: sanitizeUser(req.user) })
  } catch (err) {
    next(err)
  }
})

export default router
