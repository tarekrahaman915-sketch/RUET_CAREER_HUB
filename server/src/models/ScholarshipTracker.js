import mongoose from 'mongoose'
const { Schema } = mongoose

// One row per (student, scholarship) — the student's own study-abroad checklist.
const trackerSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scholarship: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    status: {
      type: String,
      enum: ['Saved', 'Preparing', 'Applied', 'Shortlisted', 'Awarded', 'Rejected'],
      default: 'Saved',
    },
    note: { type: String, default: '' },
  },
  { timestamps: true }
)

trackerSchema.index({ student: 1, scholarship: 1 }, { unique: true })

export default mongoose.model('ScholarshipTracker', trackerSchema)
