import mongoose from 'mongoose'
const { Schema } = mongoose

// One-to-one message between two users (e.g. student -> alumni mentor).
// `pair` is a stable key ("<smallerId>:<largerId>") so a whole conversation
// can be fetched with a single indexed query.
const directMessageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pair: { type: String, required: true, index: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
)

directMessageSchema.index({ to: 1, readAt: 1 })

export const pairKey = (a, b) => [String(a), String(b)].sort().join(':')

export default mongoose.model('DirectMessage', directMessageSchema)
