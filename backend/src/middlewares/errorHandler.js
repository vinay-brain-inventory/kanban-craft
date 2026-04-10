import { fail } from '../utils/httpResponses.js'

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const msg = err?.stack || err?.message || String(err)
    process.stderr.write(`error: ${msg}\n`)
  }
  const status = Number.isFinite(err?.status) ? err.status : 500
  const message = err?.message || 'Server error'
  const details = err?.details
  return fail(res, status, message, details)
}

