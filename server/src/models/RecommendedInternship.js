import mongoose from 'mongoose'
const { Schema } = mongoose

const recommendedInternshipSchema = new Schema(
  {
    faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, default: '' },
    description: { type: String, default: '' },
    deadline: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('RecommendedInternship', recommendedInternshipSchema)
