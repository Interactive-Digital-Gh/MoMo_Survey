// Generate an RFC-4122 v4 UUID for a survey submission id.
//
// `crypto.randomUUID()` only exists in a *secure context* (HTTPS or localhost).
// When the app is opened over a plain http:// LAN IP — e.g. testing on a phone
// via the dev server's Network URL, or any non-HTTPS host — it is undefined and
// throws, which would silently abort the click handler that starts the survey.
// So we fall back to a getRandomValues (or Math.random) implementation.
export function uuid() {
  const c = globalThis.crypto

  if (typeof c?.randomUUID === 'function') {
    return c.randomUUID()
  }

  const bytes = new Uint8Array(16)
  if (typeof c?.getRandomValues === 'function') {
    c.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }

  // Set the version (4) and variant (10xx) bits.
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return (
    hex.slice(0, 4).join('') +
    '-' +
    hex.slice(4, 6).join('') +
    '-' +
    hex.slice(6, 8).join('') +
    '-' +
    hex.slice(8, 10).join('') +
    '-' +
    hex.slice(10, 16).join('')
  )
}
