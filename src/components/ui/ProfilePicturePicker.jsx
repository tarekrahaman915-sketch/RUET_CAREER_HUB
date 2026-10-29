import { useEffect, useRef, useState } from 'react'

const MAX_BYTES = 5 * 1024 * 1024

/**
 * Lets a person choose a photo (click or drag-and-drop) and previews it
 * immediately. Reports the chosen File (or null) via onChange.
 */
export default function ProfilePicturePicker({ file, onChange, label = 'Profile picture', hint = 'JPG or PNG, up to 5 MB. You can change it later.' }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [drag, setDrag] = useState(false)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const choose = (f) => {
    setError('')
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('Please choose an image file (JPG, PNG, WebP).')
    if (f.size > MAX_BYTES) return setError('That image is over 5 MB. Please pick a smaller one.')
    onChange(f)
  }

  return (
    <div className="ui-field">
      <span className="ui-label">{label}</span>
      <div
        className={`pic-picker ${drag ? 'drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); choose(e.dataTransfer.files?.[0]) }}
      >
        <button type="button" className="pic-preview" onClick={() => inputRef.current?.click()} aria-label="Choose a profile picture">
          {preview ? <img src={preview} alt="Selected profile preview" /> : <span aria-hidden="true">＋</span>}
        </button>
        <div className="pic-actions">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: 13.5 }} onClick={() => inputRef.current?.click()}>
              {file ? 'Change photo' : 'Choose photo'}
            </button>
            {file && (
              <button type="button" className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: 13.5 }} onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}>
                Remove
              </button>
            )}
          </div>
          <span className="ui-field-hint">{file ? file.name : hint}</span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => choose(e.target.files?.[0])} />
      </div>
      {error && <span className="ui-field-error">{error}</span>}
    </div>
  )
}
