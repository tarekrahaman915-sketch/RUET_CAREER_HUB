import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, unique)
  },
})

// 10MB limit — plenty for a CV/transcript PDF.
export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// Registration happens before anyone is signed in, so there's no req.user to
// build a filename from. Images only, 5MB max.
const publicStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const rand = Math.random().toString(36).slice(2, 8)
    cb(null, `signup-${Date.now()}-${rand}${path.extname(file.originalname).toLowerCase()}`)
  },
})
export const signupPictureUpload = multer({
  storage: publicStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Profile picture must be an image file.'))
    cb(null, true)
  },
})
