import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signAccessToken, verifyAccessToken } from '../utils/tokens.js'

const toSafe = (u) => ({ id: String(u._id), name: u.name, email: u.email })

export const createAuthService = ({ jwt }) => {
  const login = async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase() }).lean()
    if (!user) return null
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return null
    const accessToken = signAccessToken({ userId: String(user._id), ...jwt })
    return { user: toSafe(user), accessToken }
  }

  const signup = async ({ name, email, password }) => {
    const exists = await User.findOne({ email: email.toLowerCase() }).select('_id').lean()
    if (exists) return { conflict: true }
    const passwordHash = await bcrypt.hash(password, 10)
    const created = await User.create({ name, email: email.toLowerCase(), passwordHash })
    const accessToken = signAccessToken({ userId: String(created._id), ...jwt })
    return { user: toSafe(created), accessToken }
  }

  const fromToken = async ({ accessToken }) => {
    if (!accessToken) return null
    const payload = verifyAccessToken({ token: accessToken, secret: jwt.secret })
    const user = await User.findById(payload.sub).lean()
    if (!user) return null
    return { user: toSafe(user) }
  }

  return { login, signup, fromToken }
}

