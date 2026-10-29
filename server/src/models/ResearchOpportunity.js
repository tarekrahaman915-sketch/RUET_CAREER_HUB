import mongoose from 'mongoose'
const { Schema } = mongoose

const researchOpportunitySchema = new Schema(
  {
    faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    deadline: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('ResearchOpportunity', researchOpportunitySchema)
