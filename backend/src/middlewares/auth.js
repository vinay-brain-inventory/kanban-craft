import { fail } from '../utils/httpResponses.js'
import { verifyAccessToken } from '../utils/tokens.js'

const AUTH_COOKIE = 'access_token'

export const requireAuth = ({ secret }) => (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE]
  if (!token) return fail(res, 401, 'Unauthorized')

  try {
    const payload = verifyAccessToken({ token, secret })
    req.user = { id: payload.sub }
    req.userId = payload.sub
    return next()
  } catch {
    return fail(res, 401, 'Unauthorized')
  }
}

