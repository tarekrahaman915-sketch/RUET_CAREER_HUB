import mongoose from 'mongoose'
const { Schema } = mongoose

const messageSchema = new Schema(
  {
    from: { type: String, default: 'System' },
    subject: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)
