import { useState } from 'react'
import { fileUrl } from '../../services/apiClient.js'

const initialOf = (name = '') => (name || '?').replace(/^((Dr|Prof|Md|Mst|Mrs|Mr)\.?\s+)+/i, '').trim().slice(0, 1).toUpperCase() || '?'

/**
 * Profile picture with an initial-letter fallback.
 * Accepts a user-like object (`person`: uploaded picture, or `photoUrl` for
 * real faculty photos hosted on ruet.ac.bd) or a raw `src`.
 */
export default function Avatar({ person, src, name, size = 44, className = '', style }) {
  const [failed, setFailed] = useState(false)
  const stored = person?.profilePicture?.storedAs
  const url = src || person?.photoUrl || (stored ? fileUrl(stored) : null)
  const label = name || person?.name || ''
  return (
    <div
      className={`avatar-circle ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)), ...style }}
      aria-label={label ? `${label}'s profile picture` : undefined}
    >
      {url && !failed ? (
        <img src={url} alt={label} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{initialOf(label)}</span>
      )}
    </div>
  )
}
