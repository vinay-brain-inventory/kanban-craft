const num = (v, fallback) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  mongoMinPoolSize: num(process.env.MONGODB_MIN_POOL_SIZE, 2),
  mongoMaxPoolSize: num(process.env.MONGODB_MAX_POOL_SIZE, 10),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTtlSeconds: num(process.env.ACCESS_TOKEN_TTL_SECONDS, 900),
  refreshTtlSeconds: num(process.env.REFRESH_TOKEN_TTL_SECONDS, 1209600),
}

export const requireEnv = (value, key) => {
  if (!value) throw new Error(`Missing env: ${key}`)
  return value
}

