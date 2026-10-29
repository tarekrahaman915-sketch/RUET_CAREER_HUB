import mongoose from 'mongoose'
const { Schema } = mongoose

const scholarshipSchema = new Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, default: '' }, // university or funding body
    country: { type: String, required: true },
    level: { type: String, enum: ['Masters', 'PhD', 'Bachelors', 'Exchange', 'Short course'], default: 'Masters' },
    funding: { type: String, enum: ['Fully funded', 'Partial', 'Tuition waiver', 'Stipend only'], default: 'Fully funded' },
    amount: { type: String, default: '' },
    fields: { type: [String], default: [] },
    deadline: { type: String, default: '' }, // YYYY-MM-DD
    eligibility: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: '' },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postedByRole: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Scholarship', scholarshipSchema)
