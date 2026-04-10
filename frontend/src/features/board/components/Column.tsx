import TaskCard from './TaskCard'
import type { Assignee, Column as ColumnT, Task, TaskStatus } from '../../../types/api'

type Props = {
  column: ColumnT
  tasks: Task[]
  assigneesById: Record<string, Assignee>
  onAddTask?: (status: TaskStatus) => void
  onDropTask?: (e: React.DragEvent<HTMLElement>, status: TaskStatus) => void
  onDragStart?: (e: React.DragEvent<HTMLElement>, task: Task) => void
  onOpenTask?: (taskId: string) => void
  activeDrop?: boolean
}

export default function Column({
  column,
  tasks,
  assigneesById,
  onAddTask,
  onDropTask,
  onDragStart,
  onOpenTask,
  activeDrop,
}: Props) {
  return (
    <div className="col">
      <div className="col__head">
        <div className="col__title">
          <span className="col__name">{column.title}</span>
          <span className="col__count">{tasks.length}</span>
        </div>
        <button type="button" className="col__add" onClick={() => onAddTask?.(column.id)}>
          + Add Task
        </button>
      </div>
      <div
        className={['col__drop', activeDrop ? 'col__drop--active' : ''].filter(Boolean).join(' ')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDropTask?.(e, column.id)}
      >
        <div className="col__stack">
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              assignee={t.assigneeId ? (assigneesById[t.assigneeId] ?? null) : null}
              onDragStart={onDragStart}
              onOpen={() => onOpenTask?.(t.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

