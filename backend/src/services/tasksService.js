import { Task } from '../models/Task.js'

const mapTask = (t) => ({
  id: String(t._id),
  title: t.title,
  description: t.description,
  status: t.status,
  assigneeId: t.assigneeId ? String(t.assigneeId) : null,
  priority: t.priority,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
})

export const createTasksService = () => {
  const list = async () => (await Task.find().sort({ createdAt: -1 }).lean()).map(mapTask)

  const get = async (id) => {
    const t = await Task.findById(id).lean()
    return t ? mapTask(t) : null
  }

  const create = async ({ title, description, status, assigneeId, priority }) => {
    const t = await Task.create({
      title,
      description: description ?? '',
      status,
      assigneeId: assigneeId ?? null,
      priority,
    })
    return mapTask(t.toObject())
  }

  const patch = async ({ id, patch }) => {
    const t = await Task.findByIdAndUpdate(id, patch, {
      returnDocument: 'after',
      runValidators: true,
    }).lean()
    if (!t) return { notFound: true }
    return { task: mapTask(t) }
  }

  const remove = async (id) => {
    const r = await Task.deleteOne({ _id: id })
    return r.deletedCount > 0
  }

  return { list, get, create, patch, remove }
}

