// Thin client for the survey backend. Uses relative /api URLs so the same code
// works in dev (Vite proxy) and prod (nginx proxy).

const TOKEN_KEY = 'momo_dashboard_token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

// ── Public survey submission ──
export async function submitSurvey(entry) {
  const res = await fetch('/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  // 2xx = stored / duplicate; 409 = already entered (one-per-phone policy).
  if (res.ok || res.status === 409) {
    return res.json().catch(() => ({}))
  }
  throw new Error(`Submit failed (${res.status})`)
}

// ── Admin auth ──
export async function login(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Login failed')
  }
  const { token } = await res.json()
  setToken(token)
  return token
}

// ── Dashboard data ──
export async function fetchResponses() {
  const res = await fetch('/api/responses', {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (res.status === 401) {
    clearToken()
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }
  if (!res.ok) {
    throw new Error(`Failed to load responses (${res.status})`)
  }
  const { entries } = await res.json()
  return entries
}
