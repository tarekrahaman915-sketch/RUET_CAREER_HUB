const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Thin fetch wrapper: attaches the JWT (if signed in), JSON-encodes plain
 * object bodies (leaves FormData alone for file uploads), and throws an
 * Error with the backend's message on non-2xx responses so callers can just
 * try/catch.
 */
async function request(path, { method = 'GET', body, isFormData = false } = {}) {
  const token = localStorage.getItem('ruet_token')
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : null

  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed (${res.status})`)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData, method = 'POST') => request(path, { method, body: formData, isFormData: true }),
}

/** Full URL for a file the backend serves statically from /uploads. */
export function fileUrl(storedAs) {
  if (!storedAs) return null
  const origin = BASE_URL.replace(/\/api\/?$/, '')
  return `${origin}/uploads/${storedAs}`
}

/** Full URL for an authenticated download/streamed endpoint (PDFs etc). */
export function apiUrl(path) {
  return `${BASE_URL}${path}`
}

/**
 * Fetches an authenticated binary endpoint (a generated CV PDF, an
 * uploaded CV, etc.) and triggers a browser download — plain <a href>
 * links can't carry the Authorization header, so this does a real fetch
 * and downloads the resulting blob instead.
 */
export async function downloadAuthenticatedFile(path, suggestedName) {
  const token = localStorage.getItem('ruet_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Download failed (${res.status})`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedName || 'download'
  a.click()
  URL.revokeObjectURL(url)
}

export default api
