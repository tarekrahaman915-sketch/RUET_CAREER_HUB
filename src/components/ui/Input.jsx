export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  hint = '',
  success = false,
}) {
  const inputClass = `ui-input ${error ? 'has-error' : ''} ${success && !error ? 'has-success' : ''}`.trim()

  return (
    <label className="ui-field">
      {label && <span className="ui-label">{label}</span>}
      <input
        className={inputClass}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="ui-field-error">{error}</span> : hint ? <span className="ui-field-hint">{hint}</span> : null}
    </label>
  )
}
