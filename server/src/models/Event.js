import mongoose from 'mongoose'
const { Schema } = mongoose

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    organizer: { type: String, default: '' },
    type: { type: String, default: 'Seminar' },
    date: { type: String, default: '' },
    venue: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Event', eventSchema)
