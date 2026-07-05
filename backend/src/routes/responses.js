import { pool } from '../db.js'

export default async function responsesRoutes(fastify) {
  // ── Public: submit a completed survey (idempotent via submission_id) ──
  fastify.post(
    '/api/responses',
    {
      config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['submission_id', 'answers'],
          additionalProperties: false,
          properties: {
            submission_id: { type: 'string', minLength: 8, maxLength: 100 },
            phone: { type: ['string', 'null'], maxLength: 40 },
            answers: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      const { submission_id, phone, answers } = request.body
      const ip = request.ip
      const ua = request.headers['user-agent'] || null

      try {
        const res = await pool.query(
          `INSERT INTO responses (submission_id, phone, answers, ip, user_agent)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (submission_id) DO NOTHING
           RETURNING id`,
          [submission_id, phone || null, JSON.stringify(answers), ip, ua],
        )

        if (res.rowCount === 0) {
          // submission_id already stored → treat as success (retry-safe).
          return reply.code(200).send({ status: 'duplicate' })
        }
        return reply.code(201).send({ status: 'created', id: res.rows[0].id })
      } catch (err) {
        // Unique violation from the optional one-entry-per-phone policy.
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
