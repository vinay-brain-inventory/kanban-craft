export type Id = string

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export type User = {
  id: Id
  name: string
  email: string
}

export type Assignee = {
  id: Id
  name: string
  role: string
  avatar: string
}

export type Task = {
  id: Id
  title: string
  description: string
  status: TaskStatus
  assigneeId: Id | null
  priority: TaskPriority
}

export type Column = {
  id: TaskStatus
  title: string
}

export type LoginPayload = { email: string; password: string }
export type SignupPayload = { name: string; email: string; password: string }

