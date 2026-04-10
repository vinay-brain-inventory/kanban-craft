const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0

const STATUSES = new Set(['todo', 'in_progress', 'review', 'done'])
const PRIORITIES = new Set(['Low', 'Medium', 'High'])
const isObjectId = (v) => typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)

export const validateCreateTaskBody = (input) => {
  if (!isObject(input)) return { ok: false, details: { _errors: ['Expected object'] } }

  const title = typeof input.title === 'string' ? input.title.trim() : input.title
  const description =
    input.description === undefined ? '' : typeof input.description === 'string' ? input.description : input.description
  const status = input.status
  const priority = input.priority
  const assigneeId = input.assigneeId

  const details = {}
  if (!isNonEmptyString(title)) details.title = ['Title is required']
  if (description !== '' && typeof description !== 'string') details.description = ['Description must be a string']
  if (typeof status !== 'string' || !STATUSES.has(status)) details.status = ['Invalid status']
  if (typeof priority !== 'string' || !PRIORITIES.has(priority)) details.priority = ['Invalid priority']
  if (
    assigneeId !== undefined &&
    assigneeId !== null &&
    !(typeof assigneeId === 'string' && assigneeId.trim().length > 0)
  )
    details.assigneeId = ['Assignee id must be a non-empty string or null']
  if (typeof assigneeId === 'string' && assigneeId.trim().length > 0 && !isObjectId(assigneeId.trim()))
    details.assigneeId = ['Assignee id must be a valid id']

  if (Object.keys(details).length) return { ok: false, details }

  return {
    ok: true,
    data: {
      title,
      description,
      status,
      priority,
      ...(assigneeId !== undefined ? { assigneeId: assigneeId === null ? null : assigneeId.trim() } : {}),
    },
  }
}

export const validatePatchTaskBody = (input) => {
  if (!isObject(input)) return { ok: false, details: { _errors: ['Expected object'] } }

  const patch = {}
  const details = {}

  if (input.title !== undefined) {
    const v = typeof input.title === 'string' ? input.title.trim() : input.title
    if (!isNonEmptyString(v)) details.title = ['Title must be a non-empty string']
    else patch.title = v
  }

  if (input.description !== undefined) {
    if (typeof input.description !== 'string') details.description = ['Description must be a string']
    else patch.description = input.description
  }

  if (input.status !== undefined) {
    if (typeof input.status !== 'string' || !STATUSES.has(input.status)) details.status = ['Invalid status']
    else patch.status = input.status
  }

  if (input.priority !== undefined) {
    if (typeof input.priority !== 'string' || !PRIORITIES.has(input.priority)) details.priority = ['Invalid priority']
    else patch.priority = input.priority
  }

  if (input.assigneeId !== undefined) {
    if (input.assigneeId === null) patch.assigneeId = null
    else if (!isNonEmptyString(input.assigneeId)) details.assigneeId = ['Assignee id must be a non-empty string or null']
    else if (!isObjectId(input.assigneeId.trim())) details.assigneeId = ['Assignee id must be a valid id']
    else patch.assigneeId = input.assigneeId.trim()
  }

  if (!Object.keys(patch).length && !Object.keys(details).length) details._errors = ['Empty patch']
  if (Object.keys(details).length) return { ok: false, details }
  return { ok: true, data: patch }
}

