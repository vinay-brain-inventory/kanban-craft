import { ok } from '../utils/httpResponses.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/errors.js'

const AUTH_COOKIE = 'access_token'

const cookieOptions = ({ nodeEnv, ttlSeconds }) => {
  const isProd = nodeEnv === 'production'
  return {
    httpOnly: true,
    secure: isProd ? true : false,
    sameSite: 'strict',
    maxAge: ttlSeconds * 1000,
    path: '/',
  }
}

export const createAuthController = ({ authService, env }) => {
  const login = asyncHandler(async (req, res) => {
    const r = await authService.login(req.validated)
    if (!r) throw new AppError(401, 'Invalid credentials')

    res.cookie(AUTH_COOKIE, r.accessToken, cookieOptions({ nodeEnv: env.nodeEnv, ttlSeconds: env.accessTtlSeconds }))
    return ok(res, { user: r.user })
  })

  const signup = asyncHandler(async (req, res) => {
    const r = await authService.signup(req.validated)
    if (r.conflict) throw new AppError(409, 'Email already exists')

    res.cookie(AUTH_COOKIE, r.accessToken, cookieOptions({ nodeEnv: env.nodeEnv, ttlSeconds: env.accessTtlSeconds }))
    return ok(res, { user: r.user })
  })

  const me = asyncHandler(async (req, res) => {
    const accessToken = req.cookies?.[AUTH_COOKIE]
    const r = await authService.fromToken({ accessToken })
    if (!r) throw new AppError(401, 'Unauthorized')
    return ok(res, { user: r.user })
  })

  const logout = asyncHandler(async (req, res) => {
    res.clearCookie(AUTH_COOKIE, { path: '/' })
    return ok(res, { loggedOut: true })
  })

  return { login, signup, me, logout }
}

