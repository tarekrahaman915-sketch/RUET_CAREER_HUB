import mongoose from 'mongoose'
const { Schema } = mongoose

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'Job',
        'Internship',
        'Application',
        'Event',
        'Notice',
        'Mentorship',
        'Research',
        'Message',
        'Company',
        'System',
      ],
      default: 'System',
    },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    // Frontend route to send the user to when they click the notification,
    // e.g. "/student/documents" or "/alumni/postings".
    link: { type: String, default: '' },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
