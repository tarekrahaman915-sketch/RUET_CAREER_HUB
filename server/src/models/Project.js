import mongoose from 'mongoose'
const { Schema } = mongoose

const projectSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    showcase: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)
