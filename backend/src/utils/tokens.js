import jwt from 'jsonwebtoken'

export const signAccessToken = ({ userId, secret, ttlSeconds }) =>
  jwt.sign({ sub: userId }, secret, { expiresIn: ttlSeconds })

export const verifyAccessToken = ({ token, secret }) => jwt.verify(token, secret)

