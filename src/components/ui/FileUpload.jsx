/**
 * File picker. `file` is either existing metadata from the server
 * ({ name, size, type }) or null. Picking a new file calls onSelect with the
 * raw browser File object so the caller can upload it; onRemove clears an
 * existing uploaded file.
 */
export default function FileUpload({ label, file, onSelect, onRemove, accept = '.pdf,.doc,.docx', busy = false }) {
  const onPick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    onSelect(f)
    e.target.value = ''
  }

  const sizeLabel = (bytes) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`
  }

  return (
    <div className="ui-field">
      {label && <span className="ui-label">{label}</span>}
      <div className="file-upload">
        {file ? (
          <div className="file-upload-chip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="1.6">
              <path d="M6 4h9l4 4v12H6z" />
              <path d="M9 12h6M9 16h6" />
            </svg>
            <div>
              <div className="file-upload-name">{file.name}</div>
              <div className="file-upload-size">{sizeLabel(file.size)}</div>
            </div>
            <button type="button" className="file-upload-remove" onClick={onRemove} aria-label="Remove file" disabled={busy}>
              ✕
            </button>
          </div>
        ) : (
          <label className="file-upload-drop">
            <input type="file" accept={accept} onChange={onPick} hidden disabled={busy} />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-mute)" strokeWidth="1.5">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span>{busy ? 'Uploading…' : `Click to upload ${accept.replaceAll(',', ' / ')}`}</span>
          </label>
        )}
      </div>
    </div>
  )
}
