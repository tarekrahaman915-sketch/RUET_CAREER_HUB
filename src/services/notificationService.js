import api from './apiClient.js'

export function getNotifications({ unread = false, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (unread) params.set('unread', 'true')
  return api.get(`/notifications?${params.toString()}`)
}

export function getUnreadCount() {
  return api.get('/notifications/unread-count')
}

export function markNotificationRead(id) {
  return api.patch(`/notifications/${id}/read`)
}

export function markAllNotificationsRead() {
  return api.patch('/notifications/read-all')
}

export function deleteNotification(id) {
  return api.delete(`/notifications/${id}`)
}
