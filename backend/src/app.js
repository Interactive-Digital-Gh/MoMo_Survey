import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import { config } from './config.js'
import { initSchema, healthCheck } from './db.js'
import authRoutes from './routes/auth.js'
import responsesRoutes from './routes/responses.js'

export async function buildApp() {
  const app = Fastify({
    logger: true,
    bodyLimit: 16 * 1024, // survey payloads are tiny; reject anything larger
    trustProxy: true, // behind nginx — derive request.ip from X-Forwarded-For
  })

  await app.register(cors, {
    origin: config.corsOrigins.length ? config.corsOrigins : false,
    methods: ['GET', 'POST'],
  })

  // Global safety net; individual routes tighten this further.
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    allowList: config.rateLimitAllowList,
  })

  await app.register(jwt, { secret: config.jwtSecret })

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
  })

  app.get('/api/health', async () => {
    await healthCheck()
    return { status: 'ok' }
  })

  await app.register(authRoutes)
  await app.register(responsesRoutes)

  await initSchema()

  return app
}
