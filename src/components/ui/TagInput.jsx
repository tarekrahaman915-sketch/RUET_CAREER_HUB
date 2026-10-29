import { useState } from 'react'

/**
 * Simple tag/chip input. Type a value and press Enter (or comma) to add it.
 * value: string[]  onChange: (nextArray) => void
 */
export default function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const v = draft.trim()
    if (!v) return
    if (!value.includes(v)) onChange([...value, v])
    setDraft('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const remove = (tag) => onChange(value.filter((t) => t !== tag))

  return (
    <div className="ui-field">
      {label && <span className="ui-label">{label}</span>}
      <div className="tag-input">
        {value.map((tag) => (
          <span className="chip-tag" key={tag}>
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>✕</button>
          </span>
        ))}
        <input
          className="tag-input-field"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          placeholder={value.length ? '' : placeholder}
        />
      </div>
    </div>
  )
}
