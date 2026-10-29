import { Link } from 'react-router-dom'

/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger'
 * to: internal route (renders a react-router Link)
 * href: external link (renders an <a>)
 * loading: shows a spinner and disables interaction (button only)
 * otherwise renders a <button>
 */
export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  block = false,
  disabled = false,
  loading = false,
  className = '',
  style,
}) {
  const cls = `btn btn-${variant} ${block ? 'btn-block' : ''} ${loading ? 'is-loading' : ''} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    )
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={cls}
        style={style}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cls} style={style}>
      {children}
    </button>
  )
}
