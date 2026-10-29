import mongoose from 'mongoose'
const { Schema } = mongoose

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    category: { type: String, enum: ['Job', 'Internship'], default: 'Job' },
    type: { type: String, default: '' }, // Full-time / Part-time / Contract / Internship
    internshipType: { type: String, default: '' },
    experience: { type: String, default: '' },
    salary: { type: String, default: '' },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    deadline: { type: String, default: '' },
    // External listings point to the employer's own careers page instead of in-app Apply.
    external: { type: Boolean, default: false },
    link: { type: String, default: '' },
    description: { type: String, default: '' },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postedByRole: { type: String, enum: ['Recruiter', 'Alumni'], required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
