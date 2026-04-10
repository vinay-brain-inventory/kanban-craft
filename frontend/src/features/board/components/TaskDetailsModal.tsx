import { useEffect, useMemo, useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import type { Assignee, Task, TaskPriority, TaskStatus } from '../../../types/api'

const statuses: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Completed' },
]

const priorities: TaskPriority[] = ['Low', 'Medium', 'High']

type Values = {
  status: TaskStatus
  assigneeId: string
  priority: TaskPriority
}

type Props = {
  open: boolean
  task: Task | null
  assignees: Assignee[]
  onClose?: () => void
  onSave?: (taskId: string, patch: Partial<Pick<Task, 'status' | 'assigneeId' | 'priority'>>) => void
}

export default function TaskDetailsModal({ open, task, assignees, onClose, onSave }: Props) {
  const [values, setValues] = useState<Values | null>(null)

  useEffect(() => {
    if (!open || !task) return
    setValues({
      status: task.status,
      assigneeId: task.assigneeId ?? '',
      priority: task.priority,
    })
  }, [open, task])

  const assigneesById = useMemo<Record<string, Assignee>>(
    () => Object.fromEntries(assignees.map((a) => [a.id, a])) as Record<string, Assignee>,
    [assignees],
  )
  const assignee = task?.assigneeId ? assigneesById[task.assigneeId] : null

  if (!open || !task || !values) return null

  const setField =
    <K extends keyof Values>(k: K) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setValues((v) => (v ? ({ ...v, [k]: e.target.value } as Values) : v))

  const save = () => {
    const patch: Partial<Pick<Task, 'status' | 'assigneeId' | 'priority'>> = {}
    if (values.status !== task.status) patch.status = values.status
    if ((values.assigneeId || null) !== (task.assigneeId || null)) patch.assigneeId = values.assigneeId || null
    if (values.priority !== task.priority) patch.priority = values.priority
    if (Object.keys(patch).length === 0) return onClose?.()
    onSave?.(task.id, patch)
    onClose?.()
  }

  return (
    <Modal
      open
      title="Task details"
      onClose={onClose}
      footer={
        <div className="row row--end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      }
    >
      <div className="tmodal">
        <div className="tmodal__title">{task.title}</div>
        {task.description ? <div className="tmodal__desc">{task.description}</div> : null}

        <div className="tmodal__grid">
          <Select label="Status" value={values.status} onChange={setField('status')}>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>

          <Select label="Priority" value={values.priority} onChange={setField('priority')}>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <Select label="Assignee" value={values.assigneeId} onChange={setField('assigneeId')}>
            <option key="unassigned" value="">
              Unassigned
            </option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} · {a.role}
              </option>
            ))}
          </Select>

          <div className="tmodal__meta">
            <div className="tmodal__label">Assigned</div>
            <div className="tmodal__value">{assignee ? `${assignee.name} · ${assignee.role}` : 'Unassigned'}</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

