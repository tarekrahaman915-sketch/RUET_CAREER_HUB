import mongoose from 'mongoose'
const { Schema } = mongoose

const verificationRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
)

export default mongoose.model('VerificationRequest', verificationRequestSchema)
