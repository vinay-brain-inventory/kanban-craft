const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0

const normalizeEmail = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v)

const isEmail = (v) => {
  if (typeof v !== 'string') return false
  // Simple, practical email check (not RFC-perfect).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export const validateLoginBody = (input) => {
  if (!isObject(input)) return { ok: false, details: { _errors: ['Expected object'] } }

  const email = normalizeEmail(input.email)
  const password = input.password

  const details = {}
  if (!isNonEmptyString(email) || !isEmail(email)) details.email = ['Invalid email']
  if (!isNonEmptyString(password)) details.password = ['Password is required']

  if (Object.keys(details).length) return { ok: false, details }
  return { ok: true, data: { email, password } }
}

export const validateSignupBody = (input) => {
  if (!isObject(input)) return { ok: false, details: { _errors: ['Expected object'] } }

  const name = typeof input.name === 'string' ? input.name.trim() : input.name
  const email = normalizeEmail(input.email)
  const password = input.password

  const details = {}
  if (!isNonEmptyString(name)) details.name = ['Name is required']
  if (!isNonEmptyString(email) || !isEmail(email)) details.email = ['Invalid email']
  if (!isNonEmptyString(password) || password.length < 6) details.password = ['Password must be at least 6 characters']

  if (Object.keys(details).length) return { ok: false, details }
  return { ok: true, data: { name, email, password } }
}

