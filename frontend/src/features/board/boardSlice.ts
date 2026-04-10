import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import type { Assignee, Column, Task, TaskStatus } from '../../types/api'
import { boardColumns } from './boardSeed'

const normalizeTitle = (s: string): string => s.trim().replace(/\s+/g, ' ')

type CreateTaskPayload = Omit<Task, 'id'>
type PatchTaskPayload = { taskId: string; patch: Partial<Omit<Task, 'id'>> }

export const fetchAssignees = createAsyncThunk('board/fetchAssignees', async () => api<Assignee[]>('/api/assignees'))
export const fetchTasks = createAsyncThunk('board/fetchTasks', async () => api<Task[]>('/api/tasks'))

export const createTask = createAsyncThunk('board/createTask', async (payload: CreateTaskPayload) =>
  api<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),
)

export const patchTask = createAsyncThunk('board/patchTask', async ({ taskId, patch }: PatchTaskPayload) =>
  api<Task>(`/api/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(patch) }),
)

type BoardState = {
  columns: Column[]
  assignees: Assignee[]
  tasks: Task[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: BoardState = {
  columns: boardColumns,
  assignees: [],
  tasks: [],
  status: 'idle',
  error: null,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addTaskLocal: (
      state,
      action: PayloadAction<{
        title: string
        description?: string
        assigneeId?: string | null
        status: TaskStatus
        priority: Task['priority']
      }>,
    ) => {
      const { title, description, assigneeId, status, priority } = action.payload
      const task: Task = {
        id: globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}`,
        title: normalizeTitle(title),
        description: description?.trim() ?? '',
        status,
        assigneeId: assigneeId ?? null,
        priority,
      }
      state.tasks.unshift(task)
    },
    moveTaskLocal: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const { taskId, status } = action.payload
      const t = state.tasks.find((x) => x.id === taskId)
      if (!t) return
      t.status = status
    },
    updateTaskLocal: (state, action: PayloadAction<{ taskId: string; patch: Partial<Omit<Task, 'id'>> }>) => {
      const { taskId, patch } = action.payload
      const t = state.tasks.find((x) => x.id === taskId)
      if (!t) return
      Object.assign(t, patch)
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAssignees.fulfilled, (state, action: PayloadAction<Assignee[] | null>) => {
      state.assignees = action.payload ?? []
    })
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[] | null>) => {
        state.status = 'succeeded'
        state.tasks = action.payload ?? []
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to load tasks'
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task | null>) => {
        if (action.payload) state.tasks.unshift(action.payload)
      })
      .addCase(patchTask.fulfilled, (state, action: PayloadAction<Task | null>) => {
        const task = action.payload
        if (!task) return
        const i = state.tasks.findIndex((t) => t.id === task.id)
        if (i >= 0) state.tasks[i] = task
      })
  },
})

export const { addTaskLocal, moveTaskLocal, updateTaskLocal } = boardSlice.actions
export default boardSlice.reducer

