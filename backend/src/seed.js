import bcrypt from 'bcryptjs'
import { User } from './models/User.js'
import { Assignee } from './models/Assignee.js'
import { Task } from './models/Task.js'

export const seedMongo = async () => {
  const seeded = { users: false, assignees: false, tasks: false }

  const userCount = await User.countDocuments()
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('demo1234', 10)
    await User.create({ name: 'Demo User', email: 'demo@kanban.craft', passwordHash })
    seeded.users = true
  }

  const assigneeCount = await Assignee.countDocuments()
  if (assigneeCount === 0) {
    await Assignee.insertMany([
      { name: 'Alisha Khan', role: 'BDE', avatar: 'AK' },
      { name: 'Amoul Sharma', role: 'Developer', avatar: 'AS' },
      { name: 'Rahul Verma', role: 'QA', avatar: 'RV' },
      { name: 'Nisha Patel', role: 'Designer', avatar: 'NP' },
    ])
    seeded.assignees = true
  }

  const taskCount = await Task.countDocuments()
  if (taskCount === 0) {
    const [assignee] = await Assignee.find().sort({ name: 1 }).limit(1).lean()
    await Task.insertMany([
      {
        title: 'Task Name',
        description: 'Lorem ipsum a big long description',
        status: 'todo',
        assigneeId: assignee?._id ?? null,
        priority: 'Low',
      },
      {
        title: 'Design board header',
        description: 'Polish spacing, search, actions',
        status: 'in_progress',
        assigneeId: assignee?._id ?? null,
        priority: 'Medium',
      },
      {
        title: 'Drag and drop tasks',
        description: 'Move between columns',
        status: 'review',
        assigneeId: assignee?._id ?? null,
        priority: 'High',
      },
    ])
    seeded.tasks = true
  }

  return seeded
}

