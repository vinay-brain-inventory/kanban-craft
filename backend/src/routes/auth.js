import { Router } from 'express'
import { validateBody } from '../middlewares/validate.js'
import { validateLoginBody, validateSignupBody } from '../validators/auth.js'

export const createAuthRouter = ({ authController }) => {
  const r = Router()

  r.post('/login', validateBody(validateLoginBody), authController.login)
  r.post('/signup', validateBody(validateSignupBody), authController.signup)
  r.get('/me', authController.me)
  r.post('/logout', authController.logout)

  return r
}

