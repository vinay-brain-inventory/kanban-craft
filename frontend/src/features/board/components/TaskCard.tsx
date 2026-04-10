import { useMemo } from 'react'
import type { Assignee, Task, TaskPriority } from '../../../types/api'

const priorityMeta: Record<TaskPriority, { cls: string }> = {
  Low: { cls: 'pill--low' },
  Medium: { cls: 'pill--mid' },
  High: { cls: 'pill--high' },
}

type Props = {
  task: Task
  assignee?: Assignee | null
  onDragStart?: ((e: React.DragEvent<HTMLElement>, task: Task) => void) | undefined
  onOpen?: () => void
}

export default function TaskCard({ task, assignee, onDragStart, onOpen }: Props) {
  const meta = useMemo(() => priorityMeta[task.priority], [task.priority])

  return (
    <div
      className="card"
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onOpen?.()}
      role="button"
      tabIndex={0}
      aria-label={`Task ${task.title}`}
    >
      <div className="card__top">
        <div className="card__title">{task.title}</div>
        <div className={['pill', meta.cls].join(' ')}>{task.priority}</div>
      </div>
      {task.description ? <div className="card__desc">{task.description}</div> : null}
      <div className="card__bottom">
        <div className="avatar" title={assignee?.name ?? 'Unassigned'}>
          {assignee?.avatar ?? '—'}
        </div>
        <div className="card__meta">
          <div className="card__name">{assignee?.name ?? 'Unassigned'}</div>
          {assignee?.role ? <div className="card__role">{assignee.role}</div> : null}
        </div>
      </div>
    </div>
  )
}

