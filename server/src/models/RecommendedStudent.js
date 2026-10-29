import mongoose from 'mongoose'
const { Schema } = mongoose

const recommendedStudentSchema = new Schema(
  {
    faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    recommendedFor: { type: String, default: '' },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('RecommendedStudent', recommendedStudentSchema)
