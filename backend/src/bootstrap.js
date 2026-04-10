import { createApp } from './app.js'
import { connectMongo } from './db/mongo.js'
import { seedMongo } from './seed.js'

import { createAuthService } from './services/authService.js'
import { createAssigneesService } from './services/assigneesService.js'
import { createTasksService } from './services/tasksService.js'

import { createAuthController } from './controllers/authController.js'
import { createAssigneesController } from './controllers/assigneesController.js'
import { createTasksController } from './controllers/tasksController.js'

export const bootstrap = async ({ env }) => {
  const conn = await connectMongo({
    uri: env.mongoUri,
    minPoolSize: env.mongoMinPoolSize,
    maxPoolSize: env.mongoMaxPoolSize,
  })

  const seeded = await seedMongo()

  const services = {
    auth: createAuthService({
      jwt: {
        secret: env.jwtAccessSecret,
        ttlSeconds: env.accessTtlSeconds,
      },
    }),
    assignees: createAssigneesService(),
    tasks: createTasksService(),
  }

  const controllers = {
    auth: createAuthController({ authService: services.auth, env }),
    assignees: createAssigneesController({ assigneesService: services.assignees }),
    tasks: createTasksController({ tasksService: services.tasks }),
  }

  const app = createApp({
    corsOrigin: env.corsOrigin,
    controllers,
    auth: { secret: env.jwtAccessSecret },
  })

  return { app, conn, seeded }
}

