// Strips sensitive/internal fields before sending a user back to the client.
export function sanitizeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc
  const { passwordHash, __v, ...safe } = user
  return safe
}
