import { Router } from 'express'
import path from 'path'
import Resource from '../models/Resource.js'
import { requireAuth, requireActive, requireRole } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

// Public — anyone can browse and download
router.get('/', async (req, res, next) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name role').sort({ createdAt: -1 })
    res.json({ resources })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/download', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: 'Resource not found.' })
    res.download(path.resolve('uploads', resource.storedAs), resource.fileName)
  } catch (err) {
    next(err)
  }
})

// Faculty and Admin can upload
router.post(
  '/',
  requireAuth,
  requireActive,
  requireRole('Faculty', 'Admin'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
      const resource = await Resource.create({
        title: req.body.title,
        type: req.body.type || 'PDF',
        department: req.body.department || '',
        uploadedBy: req.user._id,
        fileName: req.file.originalname,
        storedAs: req.file.filename,
        size: req.file.size,
      })
      res.status(201).json({ resource })
    } catch (err) {
      next(err)
    }
  }
)

router.delete('/:id', requireAuth, requireActive, requireRole('Faculty', 'Admin'), async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ message: 'Resource not found.' })
    if (req.user.role !== 'Admin' && !resource.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not your upload.' })
    }
    await resource.deleteOne()
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

export default router
