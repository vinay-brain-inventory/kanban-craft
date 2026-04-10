import type { Assignee, Column, Task } from '../../types/api'

export const seedAssignees: Assignee[] = [
  { id: 'e1', name: 'Alisha Khan', role: 'BDE', avatar: 'AK' },
  { id: 'e2', name: 'Amoul Sharma', role: 'Developer', avatar: 'AS' },
  { id: 'e3', name: 'Rahul Verma', role: 'QA', avatar: 'RV' },
  { id: 'e4', name: 'Nisha Patel', role: 'Designer', avatar: 'NP' },
]

export const boardColumns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Completed' },
]

export const seedTasks: Task[] = [
  {
    id: 't1',
    title: 'Task Name',
    description: 'Lorem ipsum a big long description',
    status: 'todo',
    assigneeId: 'e2',
    priority: 'Low',
  },
  {
    id: 't2',
    title: 'Design board header',
    description: 'Polish spacing, search, actions',
    status: 'in_progress',
    assigneeId: 'e4',
    priority: 'Medium',
  },
  {
    id: 't3',
    title: 'Drag and drop tasks',
    description: 'Move between columns',
    status: 'review',
    assigneeId: 'e1',
    priority: 'High',
  },
]

