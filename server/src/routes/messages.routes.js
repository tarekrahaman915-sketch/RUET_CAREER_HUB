import { Router } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import DirectMessage, { pairKey } from '../models/DirectMessage.js'
import { requireAuth, requireActive } from '../middleware/auth.js'
import { notifyUser } from '../utils/notify.js'

const router = Router()
router.use(requireAuth, requireActive)

const isId = (id) => mongoose.Types.ObjectId.isValid(id)

// Inbox: one row per person you've talked to, newest first, with unread count.
router.get('/threads', async (req, res, next) => {
  try {
    const me = req.user._id
    const msgs = await DirectMessage.find({ $or: [{ from: me }, { to: me }] }).sort({ createdAt: -1 }).limit(500)

    const threads = new Map()
    for (const m of msgs) {
      const otherId = String(m.from) === String(me) ? String(m.to) : String(m.from)
      if (!threads.has(otherId)) threads.set(otherId, { otherId, last: m, unread: 0 })
      if (String(m.to) === String(me) && !m.readAt) threads.get(otherId).unread += 1
    }

    const others = await User.find({ _id: { $in: [...threads.keys()] } }, 'name role department profilePicture')
    const byId = Object.fromEntries(others.map((u) => [String(u._id), u]))

    res.json({
      threads: [...threads.values()]
        .filter((t) => byId[t.otherId])
        .map((t) => ({
          user: byId[t.otherId],
          lastMessage: { body: t.last.body, createdAt: t.last.createdAt, mine: String(t.last.from) === String(me) },
          unread: t.unread,
        })),
    })
  } catch (err) {
    next(err)
  }
})

router.get('/unread-count', async (req, res, next) => {
  try {
    const count = await DirectMessage.countDocuments({ to: req.user._id, readAt: null })
    res.json({ count })
  } catch (err) {
    next(err)
  }
})

// Full conversation with one person; opening it marks their messages as read.
router.get('/with/:userId', async (req, res, next) => {
  try {
    if (!isId(req.params.userId)) return res.status(404).json({ message: 'Person not found.' })
    const other = await User.findOne({ _id: req.params.userId, status: 'Active' }, 'name role department profilePicture')
    if (!other) return res.status(404).json({ message: 'Person not found.' })

    const key = pairKey(req.user._id, other._id)
    await DirectMessage.updateMany({ pair: key, to: req.user._id, readAt: null }, { readAt: new Date() })
    const messages = await DirectMessage.find({ pair: key }).sort({ createdAt: 1 }).limit(300)
    res.json({ user: other, messages })
  } catch (err) {
    next(err)
  }
})

router.post('/to/:userId', async (req, res, next) => {
  try {
    if (!isId(req.params.userId)) return res.status(404).json({ message: 'Person not found.' })
    const body = String(req.body.body || '').trim()
    if (!body) return res.status(400).json({ message: 'Write a message first.' })
    if (body.length > 2000) return res.status(400).json({ message: 'Messages can be up to 2000 characters.' })
    if (String(req.params.userId) === String(req.user._id)) return res.status(400).json({ message: "You can't message yourself." })

    const other = await User.findOne({ _id: req.params.userId, status: 'Active' }, 'name role')
    if (!other) return res.status(404).json({ message: 'Person not found.' })

    const message = await DirectMessage.create({
      from: req.user._id,
      to: other._id,
      pair: pairKey(req.user._id, other._id),
      body,
    })

    notifyUser(other._id, {
      type: 'Message',
      title: `New message from ${req.user.name}`,
      body: body.length > 90 ? `${body.slice(0, 90)}…` : body,
      link: `/messages/${req.user._id}`,
    })

    res.status(201).json({ message })
  } catch (err) {
    next(err)
  }
})

export default router
