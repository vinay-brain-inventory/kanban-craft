import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { logOutServer } from '../auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createTask, fetchAssignees, fetchTasks, patchTask } from './boardSlice'
import Column from './components/Column'
import CreateTaskModal from './components/CreateTaskModal'
import TaskDetailsModal from './components/TaskDetailsModal'
import type { Assignee, Task, TaskStatus } from '../../types/api'

const taskDndType = 'application/x-kanban-task'

const encodeDrag = (taskId: string): string => JSON.stringify({ taskId })

const decodeDrag = (str: string): { taskId: string } | null => {
  try {
    const v = JSON.parse(str) as unknown
    if (v && typeof v === 'object' && 'taskId' in v && typeof (v as { taskId: unknown }).taskId === 'string') return v as {
      taskId: string
    }
    return null
  } catch {
    return null
  }
}

export default function BoardPage() {
  const dispatch = useAppDispatch()
  const { columns, tasks, assignees } = useAppSelector((s) => s.board)
  const user = useAppSelector((s) => s.auth.currentUser)
  const [query, setQuery] = useState<string>('')
  const [createOpen, setCreateOpen] = useState<boolean>(false)
  const [createStatus, setCreateStatus] = useState<TaskStatus>('todo')
  const [activeDrop, setActiveDrop] = useState<TaskStatus | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAssignees())
    dispatch(fetchTasks())
  }, [dispatch])

  const assigneesById = useMemo<Record<string, Assignee>>(
    () => Object.fromEntries(assignees.map((a) => [a.id, a])) as Record<string, Assignee>,
    [assignees],
  )
  const q = query.trim().toLowerCase()

  const visibleTasks = useMemo<Task[]>(() => {
    if (!q) return tasks
    return tasks.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(q))
  }, [tasks, q])

  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const groups: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], review: [], done: [] }
    for (const t of visibleTasks) groups[t.status]?.push(t)
    return groups
  }, [visibleTasks, columns])

  const startDrag = (e: React.DragEvent<HTMLElement>, task: Task): void => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData(taskDndType, encodeDrag(task.id))
  }

  const dropTask = (e: React.DragEvent<HTMLElement>, status: TaskStatus): void => {
    e.preventDefault()
    setActiveDrop(null)
    const data = decodeDrag(e.dataTransfer.getData(taskDndType))
    if (!data) return
    dispatch(patchTask({ taskId: data.taskId, patch: { status } }))
  }

  const openCreate = (status: TaskStatus): void => {
    setCreateStatus(status)
    setCreateOpen(true)
  }

  const submitCreate = (data: Omit<Task, 'id' | 'status'>): void => {
    dispatch(createTask({ ...(data as Omit<Task, 'id'>), status: createStatus }))
  }

  const selectedTask = selectedId ? tasks.find((t) => t.id === selectedId) ?? null : null

  const statusLabel: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Completed',
  }

  return (
    <div className="dash">
      <div className="dash__top">
        <div>
          <div className="dash__title">Tasks</div>
          <div className="dash__sub">{user ? `${user.name} · ${user.email}` : 'Kanban board'}</div>
        </div>
        <div className="dash__actions">
          <div className="dash__search">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" />
          </div>
          <Button onClick={() => openCreate('todo')}>Add Task</Button>
          <Button variant="ghost" onClick={() => dispatch(logOutServer())}>
            Log out
          </Button>
        </div>
      </div>

      <div className="board">
        {columns.map((c) => (
          <div
            key={c.id}
            onDragEnter={() => setActiveDrop(c.id)}
            onDragLeave={() => setActiveDrop((v) => (v === c.id ? null : v))}
          >
            <Column
              column={c}
              tasks={tasksByStatus[c.id] ?? []}
              assigneesById={assigneesById}
              onAddTask={openCreate}
              onDropTask={dropTask}
              onDragStart={startDrag}
              activeDrop={activeDrop === c.id}
              onOpenTask={(id) => setSelectedId(id)}
            />
          </div>
        ))}
      </div>

      <div className="dash__section">
        <div className="panel">
          <div className="panel__head">
            <div className="panel__title">Tasks list</div>
            <div className="cell-muted">{visibleTasks.length} items</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ minWidth: 240 }}>Title</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((t) => {
                  const assignee = t.assigneeId ? assigneesById[t.assigneeId] : null
                  return (
                    <tr key={t.id} onClick={() => setSelectedId(t.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="table__title">{t.title}</div>
                        {t.description ? <div className="table__sub">{t.description}</div> : null}
                      </td>
                      <td>
                        <span className={`tag tag--${t.status}`}>{statusLabel[t.status]}</span>
                      </td>
                      <td className="cell-muted">{assignee ? assignee.name : 'Unassigned'}</td>
                      <td>
                        <span className="pill">{t.priority}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateTaskModal
        open={createOpen}
        assignees={assignees}
        initialStatus={createStatus}
        onClose={() => setCreateOpen(false)}
        onCreate={submitCreate}
      />

      <TaskDetailsModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        assignees={assignees}
        onClose={() => setSelectedId(null)}
        onSave={(taskId, patch) => dispatch(patchTask({ taskId, patch }))}
      />
    </div>
  )
}

