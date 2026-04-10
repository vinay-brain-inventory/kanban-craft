import { ok } from '../utils/httpResponses.js'

export const createAssigneesController = ({ assigneesService }) => {
  const list = async (req, res) => ok(res, await assigneesService.list())
  return { list }
}

