import mongoose from 'mongoose'
const { Schema } = mongoose

// A simple flag collection — "is this company name verified by admin?"
const verifiedCompanySchema = new Schema({
  name: { type: String, required: true, unique: true },
})

export default mongoose.model('VerifiedCompany', verifiedCompanySchema)
