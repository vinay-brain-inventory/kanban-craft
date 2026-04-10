import { useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'
import type { Assignee, Task, TaskPriority, TaskStatus } from '../../../types/api'

const priorities: TaskPriority[] = ['Low', 'Medium', 'High']

type Values = {
  title: string
  description: string
  assigneeId: string
  priority: TaskPriority
  status: TaskStatus
}

type Props = {
  open: boolean
  assignees: Assignee[]
  initialStatus?: TaskStatus
  onClose?: () => void
  onCreate?: (data: Omit<Task, 'id'>) => void
}

export default function CreateTaskModal({ open, assignees, initialStatus, onClose, onCreate }: Props) {
  const [values, setValues] = useState<Values>({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'Low',
    status: initialStatus ?? 'todo',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!values.title.trim()) e.title = 'Title is required'
    if (!values.status) e.status = 'Select a status'
    return e
  }, [values])

  const canSubmit = Object.keys(errors).length === 0

  const setField =
    <K extends keyof Values>(k: K) =>
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [k]: ev.target.value } as Values))

  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }))

  const close = () => {
    setTouched({})
    onClose?.()
  }

  const create = (ev: React.FormEvent) => {
    ev.preventDefault()
    setTouched({ title: true, status: true })
    if (!canSubmit) return
    onCreate?.({
      ...values,
      assigneeId: values.assigneeId || null,
    } as Omit<Task, 'id'>)
    setValues((v) => ({
      ...v,
      title: '',
      description: '',
      priority: 'Low',
      status: initialStatus ?? v.status,
    }))
    close()
  }

  return (
    <Modal
      open={open}
      title="Add Task"
      onClose={close}
      footer={
        <div className="row row--end">
          <Button variant="ghost" type="button" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="create-task" disabled={!canSubmit}>
            Create
          </Button>
        </div>
      }
    >
      <form id="create-task" className="stack" onSubmit={create}>
        <Input
          label="Task name"
          value={values.title}
          onChange={setField('title')}
          onBlur={blur('title')}
          error={touched.title ? errors.title : null}
          placeholder="Add a clear task title"
        />
        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            className="field__input field__textarea"
            value={values.description}
            onChange={setField('description')}
            placeholder="Optional details"
            rows={3}
          />
        </label>
        <div className="grid2">
          <Select
            label="Assign to"
            value={values.assigneeId}
            onChange={setField('assigneeId')}
            onBlur={blur('assigneeId')}
            error={touched.assigneeId ? errors.assigneeId : null}
          >
            <option key="unassigned" value="">
              Unassigned
            </option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} · {a.role}
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
        </div>
      </form>
    </Modal>
  )
}

