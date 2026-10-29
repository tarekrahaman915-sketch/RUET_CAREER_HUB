import { Router } from 'express'
import Notification from '../models/Notification.js'
import { requireAuth, requireActive } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireActive)

// GET /api/notifications?unread=true&page=1&limit=20
router.get('/', async (req, res, next) => {
  try {
    const { unread, page = 1, limit = 20 } = req.query
    const filter = { user: req.user._id }
    if (unread === 'true') filter.read = false

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20))

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ])

    res.json({ notifications, total, page: pageNum, limit: limitNum, unreadCount })
  } catch (err) {
    next(err)
  }
})

router.get('/unread-count', async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false })
    res.json({ unreadCount })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ message: 'Notification not found.' })
    res.json({ notification })
  } catch (err) {
    next(err)
  }
})

router.patch('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
    res.json({ message: 'All notifications marked as read.' })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Notification.deleteOne({ _id: req.params.id, user: req.user._id })
    if (!result.deletedCount) return res.status(404).json({ message: 'Notification not found.' })
    res.json({ message: 'Removed.' })
  } catch (err) {
    next(err)
  }
})

export default router
