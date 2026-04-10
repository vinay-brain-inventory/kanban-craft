import { Router } from 'express'

export const createAssigneesRouter = ({ assigneesController }) => {
  const r = Router()

  r.get('/', assigneesController.list)

  return r
}

