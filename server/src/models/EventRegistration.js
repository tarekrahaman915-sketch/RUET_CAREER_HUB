import mongoose from 'mongoose'
const { Schema } = mongoose

const eventRegistrationSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  },
  { timestamps: true }
)

eventRegistrationSchema.index({ student: 1, event: 1 }, { unique: true })

export default mongoose.model('EventRegistration', eventRegistrationSchema)
