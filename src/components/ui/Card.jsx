export default function Card({ title, children, className = '' }) {
  return (
    <div className={`ui-card ${className}`.trim()}>
      {title && <div className="ui-card-title">{title}</div>}
      {children}
    </div>
  )
}
