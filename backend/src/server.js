import 'dotenv/config'
import { env, requireEnv } from './config/env.js'
import { getMongoInfo } from './db/mongo.js'
import { bootstrap } from './bootstrap.js'

const start = async () => {
  requireEnv(env.mongoUri, 'MONGODB_URI')
  requireEnv(env.jwtAccessSecret, 'JWT_ACCESS_SECRET')

  process.stdout.write(`env: ${env.nodeEnv}\n`)
  process.stdout.write(`cors: ${env.corsOrigin}\n`)

  const { app, conn, seeded } = await bootstrap({ env })
  const mongoInfo = getMongoInfo(conn)
  process.stdout.write(`mongo: connected (${mongoInfo.name}@${mongoInfo.host}:${mongoInfo.port})\n`)

  const seededKeys = Object.entries(seeded)
    .filter(([, v]) => v)
    .map(([k]) => k)
  process.stdout.write(`seed: ${seededKeys.length ? seededKeys.join(', ') : 'skipped'}\n`)

  app.listen(env.port, () => {
    process.stdout.write(`api: http://localhost:${env.port}\n`)
  })
}

start().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`)
  process.exit(1)
})

