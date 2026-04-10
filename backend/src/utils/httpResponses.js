export const ok = (res, data) => res.json({ ok: true, data })

export const fail = (res, status, message, details) =>
  res.status(status).json({ ok: false, error: { message, details } })

