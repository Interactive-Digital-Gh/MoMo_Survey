import { buildApp } from './app.js'
import { config } from './config.js'
import { pool } from './db.js'

const app = await buildApp()

try {
  await app.listen({ port: config.port, host: config.host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

// Graceful shutdown so systemd restarts/stops cleanly.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, shutting down`)
    await app.close()
    await pool.end()
    process.exit(0)
  })
}
