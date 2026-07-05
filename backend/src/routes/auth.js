import crypto from 'node:crypto'
import { config } from '../config.js'

// Constant-time string comparison to avoid leaking timing info on login.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export default async function authRoutes(fastify) {
  fastify.post(
    '/api/auth/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          additionalProperties: false,
          properties: {
            username: { type: 'string', maxLength: 100 },
            password: { type: 'string', maxLength: 200 },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body
      const ok =
        safeEqual(username, config.admin.username) &&
        safeEqual(password, config.admin.password)

      if (!ok) {
        return reply.code(401).send({ error: 'Invalid username or password' })
      }

      const token = await reply.jwtSign(
        { sub: username, role: 'admin' },
        { expiresIn: '12h' },
      )
      return { token }
    },
  )
}
