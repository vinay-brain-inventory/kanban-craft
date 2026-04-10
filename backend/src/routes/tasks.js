import { Router } from 'express'
import { validateBody } from '../middlewares/validate.js'
import { validateCreateTaskBody, validatePatchTaskBody } from '../validators/tasks.js'

export const createTasksRouter = ({ tasksController }) => {
  const r = Router()

  r.get('/', tasksController.list)
  r.get('/:id', tasksController.get)
  r.post('/', validateBody(validateCreateTaskBody), tasksController.create)
  r.patch('/:id', validateBody(validatePatchTaskBody), tasksController.patch)
  r.delete('/:id', tasksController.remove)

  return r
}

