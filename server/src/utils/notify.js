import Notification from '../models/Notification.js'
import User from '../models/User.js'

/**
 * Create one notification for one user. Fire-and-forget from the caller's
 * point of view — failures are logged, never thrown, so a notification bug
 * can't break the primary action (posting a job, updating a status, etc.).
 */
export async function notifyUser(userId, { type = 'System', title, body = '', link = '' }) {
  if (!userId || !title) return
  try {
    await Notification.create({ user: userId, type, title, body, link })
  } catch (err) {
    console.error('notifyUser failed:', err.message)
  }
}

/** Same notification fanned out to many users at once (e.g. all students). */
export async function notifyUsers(userIds, { type = 'System', title, body = '', link = '' }) {
  if (!userIds?.length || !title) return
  try {
    await Notification.insertMany(
      userIds.map((user) => ({ user, type, title, body, link })),
      { ordered: false }
    )
  } catch (err) {
    console.error('notifyUsers failed:', err.message)
  }
}

/** Notify every Active user with a given role (e.g. broadcast a notice to all students). */
export async function notifyRole(role, { type = 'System', title, body = '', link = '' }) {
  try {
    const users = await User.find({ role, status: 'Active' }, '_id')
    await notifyUsers(
      users.map((u) => u._id),
      { type, title, body, link }
    )
  } catch (err) {
    console.error('notifyRole failed:', err.message)
  }
}
