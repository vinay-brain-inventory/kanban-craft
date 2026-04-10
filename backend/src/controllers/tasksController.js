import { fail, ok } from '../utils/httpResponses.js'

export const createTasksController = ({ tasksService }) => {
  const list = async (req, res) => ok(res, await tasksService.list())

  const get = async (req, res) => {
    const task = await tasksService.get(req.params.id)
    if (!task) return fail(res, 404, 'Task not found')
    return ok(res, task)
  }

  const create = async (req, res) => ok(res, await tasksService.create(req.validated))

  const patch = async (req, res) => {
    const r = await tasksService.patch({ id: req.params.id, patch: req.validated })
    if (r.notFound) return fail(res, 404, 'Task not found')
    return ok(res, r.task)
  }

  const remove = async (req, res) => {
    const okDelete = await tasksService.remove(req.params.id)
    if (!okDelete) return fail(res, 404, 'Task not found')
    return ok(res, { id: req.params.id })
  }

  return { list, get, create, patch, remove }
}

