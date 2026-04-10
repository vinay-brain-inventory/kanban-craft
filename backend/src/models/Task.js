import mongoose from 'mongoose'

const statuses = ['todo', 'in_progress', 'review', 'done']
const priorities = ['Low', 'Medium', 'High']

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: { type: String, required: true, enum: statuses, index: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignee', default: null },
    priority: { type: String, required: true, enum: priorities, index: true },
  },
  { timestamps: true },
)

export const Task = mongoose.models.Task || mongoose.model('Task', schema)

