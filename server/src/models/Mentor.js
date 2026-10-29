import mongoose from 'mongoose'
const { Schema } = mongoose

const mentorSchema = new Schema(
  {
    alumni: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    bio: { type: String, default: '' },
    expertise: { type: [String], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('Mentor', mentorSchema)
