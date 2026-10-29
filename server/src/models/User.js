import mongoose from 'mongoose'

const { Schema } = mongoose

const documentMetaSchema = new Schema(
  { name: String, size: Number, type: String, storedAs: String },
  { _id: false }
)

const certificationSchema = new Schema({
  name: String,
  issuer: String,
  date: String,
  link: String,
})

const publicationSchema = new Schema({
  title: { type: String, required: true, trim: true },
  authors: { type: String, default: '' },
  venue: { type: String, default: '' }, // journal / conference / platform
  year: { type: String, default: '' },
  link: { type: String, default: '' }, // DOI / paper URL — rendered as a clickable link
  type: { type: String, enum: ['Journal', 'Conference', 'Thesis', 'Preprint', 'Book chapter', 'Patent', 'Other'], default: 'Other' },
})

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Student', 'Alumni', 'Faculty', 'Recruiter', 'Admin'],
      required: true,
    },
    department: { type: String, default: '' },
    // New accounts wait for Admin approval before signing in (see
    // routes/auth.routes.js). Admin accounts are created directly via
    // seed.js and don't go through this.
    status: { type: String, enum: ['PendingApproval', 'Active', 'Suspended'], default: 'PendingApproval' },

    profilePicture: { type: documentMetaSchema, default: null },

    // Shown on the public profile for every role
    headline: { type: String, default: '', trim: true, maxlength: 140 },
    bio: { type: String, default: '', maxlength: 1200 },
    contactLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    publications: { type: [publicationSchema], default: [] },

    // Career path the person has chosen (ids from src/data/careerPaths.js on
    // the frontend) and which roadmap steps they've ticked off per path.
    careerPath: {
      primary: { type: String, default: '' },
      interests: { type: [String], default: [] },
    },
    roadmapProgress: { type: Schema.Types.Mixed, default: {} },

    studentProfile: {
      studentId: { type: String, default: '' },
      semester: { type: String, default: '' },
      batch: { type: String, default: '' },
      gpa: { type: String, default: '' },
      researchInterest: { type: String, default: '' },
      careerInterest: { type: String, default: '' },
      skills: { type: [String], default: [] },
      languages: { type: [String], default: [] },
      documents: {
        cv: { type: documentMetaSchema, default: null },
        transcript: { type: documentMetaSchema, default: null },
      },
      certifications: { type: [certificationSchema], default: [] },
      portfolio: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
      },
      savedJobIds: { type: [Schema.Types.ObjectId], ref: 'Job', default: [] },
      registeredEventIds: { type: [Schema.Types.ObjectId], ref: 'Event', default: [] },
    },

    alumniProfile: {
      jobPosition: {
        position: { type: String, default: '' },
        company: { type: String, default: '' },
        experience: { type: String, default: '' },
      },
      mentor: {
        isMentor: { type: Boolean, default: false },
        bio: { type: String, default: '' },
        expertise: { type: [String], default: [] },
      },
    },

    companyProfile: {
      companyName: { type: String, default: '' },
    },
  },
  { timestamps: true, minimize: false }
)

export default mongoose.model('User', userSchema)
