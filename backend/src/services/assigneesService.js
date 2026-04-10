import { Assignee } from '../models/Assignee.js'

export const createAssigneesService = () => {
  const mapAssignee = (a) => ({
    id: String(a._id),
    name: a.name,
    role: a.role,
    avatar: a.avatar,
  })

  const list = async () => (await Assignee.find().sort({ name: 1 }).lean()).map(mapAssignee)
  return { list }
}

