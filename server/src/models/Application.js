import mongoose from 'mongoose'
const { Schema } = mongoose

const applicationSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview scheduled', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
    interview: {
      date: String,
      time: String,
      link: String,
    },
  },
  { timestamps: true }
)

applicationSchema.index({ student: 1, job: 1 }, { unique: true })

export default mongoose.model('Application', applicationSchema)
