import mongoose from 'mongoose'
const { Schema } = mongoose

const noticeSchema = new Schema(
  {
    faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Notice', noticeSchema)
