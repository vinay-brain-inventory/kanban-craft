import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

export const Assignee = mongoose.models.Assignee || mongoose.model('Assignee', schema)

