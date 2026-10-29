// Tiny helpers around the mock localStorage-based auth used throughout the
// app (see pages/auth/Login.jsx and Register.jsx). Centralized here so the
// same checks aren't duplicated on every public page that wants to know
// "is a student currently signed in on this browser?".
export function isAuthenticated() {
  return Boolean(localStorage.getItem('ruet_token'))
}

export function getCurrentRole() {
  return localStorage.getItem('ruet_role') || null
}

export function isStudent() {
  return isAuthenticated() && getCurrentRole() === 'Student'
}
