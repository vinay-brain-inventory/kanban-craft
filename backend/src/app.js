import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ok } from './utils/httpResponses.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { requireAuth } from './middlewares/auth.js'
import { createAuthRouter } from './routes/auth.js'
import { createTasksRouter } from './routes/tasks.js'
import { createAssigneesRouter } from './routes/assignees.js'

export const createApp = ({ corsOrigin, controllers, auth }) => {
  const app = express()
  app.use(cors({ origin: corsOrigin, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  app.get('/api/health', (req, res) => ok(res, { status: 'ok' }))
  app.use('/api/auth', createAuthRouter({ authController: controllers.auth }))
  app.use('/api/assignees', requireAuth(auth), createAssigneesRouter({ assigneesController: controllers.assignees }))
  app.use('/api/tasks', requireAuth(auth), createTasksRouter({ tasksController: controllers.tasks }))

  app.use(notFound)
  app.use(errorHandler)
  return app
}

