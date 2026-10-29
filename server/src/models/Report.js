import mongoose from 'mongoose'
const { Schema } = mongoose

const reportSchema = new Schema(
  {
    subject: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
  },
  { timestamps: true }
)

export default mongoose.model('Report', reportSchema)
