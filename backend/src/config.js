import 'dotenv/config'

function required(name) {
  const v = process.env[name]
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return v
}

export const config = {
  port: Number(process.env.PORT || 3001),
  host: process.env.HOST || '127.0.0.1',
  databaseUrl: required('DATABASE_URL'),
  admin: {
    username: required('ADMIN_USERNAME'),
    password: required('ADMIN_PASSWORD'),
  },
  jwtSecret: required('JWT_SECRET'),
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  oneEntryPerPhone: process.env.ONE_ENTRY_PER_PHONE === 'true',
  // IPs exempt from rate limiting (health monitors, internal load tests).
  rateLimitAllowList: (process.env.RATE_LIMIT_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}
