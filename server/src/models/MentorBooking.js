import mongoose from 'mongoose'
const { Schema } = mongoose

const mentorBookingSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    studentName: { type: String, default: '' },
    mentorName: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    status: { type: String, enum: ['Requested', 'Confirmed'], default: 'Requested' },
    meetLink: { type: String, default: '' },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('MentorBooking', mentorBookingSchema)
