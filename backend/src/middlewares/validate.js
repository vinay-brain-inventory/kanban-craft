import { fail } from '../utils/httpResponses.js'

export const validateBody = (validate) => (req, res, next) => {
  const r = validate(req.body)
  if (r?.ok) {
    req.validated = r.data
    return next()
  }
  return fail(res, 400, 'Invalid payload', r?.details)
}

