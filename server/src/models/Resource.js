import mongoose from 'mongoose'
const { Schema } = mongoose

const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, default: 'PDF' }, // PDF / Book / Notes / Lecture / Video / Previous Questions
    department: { type: String, default: '' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    storedAs: { type: String, required: true },
    size: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Resource', resourceSchema)
