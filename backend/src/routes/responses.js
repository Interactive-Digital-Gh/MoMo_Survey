import { pool } from '../db.js'
import { normalizePhoneGh } from '../lib/phone.js'

export default async function responsesRoutes(fastify) {
  // ── Public: has this phone already entered? (used by the phone screen) ──
  fastify.get(
    '/api/responses/exists',
    {
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
      schema: {
        querystring: {
          type: 'object',
          required: ['phone'],
          properties: { phone: { type: 'string', maxLength: 40 } },
        },
      },
    },
    async (request) => {
      const { valid, e164 } = normalizePhoneGh(request.query.phone)
      if (!valid) return { exists: false }
      const res = await pool.query(
        'SELECT 1 FROM responses WHERE phone = $1 LIMIT 1',
        [e164],
      )
      return { exists: res.rowCount > 0 }
    },
  )

  // ── Public: submit a completed survey (idempotent via submission_id) ──
  fastify.post(
    '/api/responses',
    {
      config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['submission_id', 'phone', 'answers'],
          additionalProperties: false,
          properties: {
            submission_id: { type: 'string', minLength: 8, maxLength: 100 },
            phone: { type: 'string', maxLength: 40 },
            answers: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      const { submission_id, phone, answers } = request.body
      const ip = request.ip
      const ua = request.headers['user-agent'] || null

      // Must be a valid MTN Ghana number; store the normalised (E.164) form so
      // the same number entered different ways can't enter twice.
      const { valid, e164 } = normalizePhoneGh(phone)
      if (!valid) {
        return reply
          .code(422)
          .send({ error: 'A valid MTN Ghana phone number is required' })
      }

      try {
        const res = await pool.query(
          `INSERT INTO responses (submission_id, phone, answers, ip, user_agent)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (submission_id) DO NOTHING
           RETURNING id`,
          [submission_id, e164, JSON.stringify(answers), ip, ua],
        )

        if (res.rowCount === 0) {
          // submission_id already stored → treat as success (retry-safe).
          return reply.code(200).send({ status: 'duplicate' })
        }
        return reply.code(201).send({ status: 'created', id: res.rows[0].id })
      } catch (err) {
        // Unique violation from the one-entry-per-phone policy.
        if (err.code === '23505') {
          return reply
            .code(409)
            .send({ error: 'An entry already exists for this phone number' })
        }
        throw err
      }
    },
  )

  // ── Protected: list all entries for the dashboard ──
  fastify.get(
    '/api/responses',
    { onRequest: [fastify.authenticate] },
    async () => {
      const res = await pool.query(
        `SELECT id, submission_id, phone, answers, created_at
         FROM responses
         ORDER BY created_at DESC`,
      )
      return { entries: res.rows }
    },
  )
}
