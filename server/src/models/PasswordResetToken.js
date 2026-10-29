import mongoose from 'mongoose'
const { Schema } = mongoose

const passwordResetTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
})

export default mongoose.model('PasswordResetToken', passwordResetTokenSchema)
