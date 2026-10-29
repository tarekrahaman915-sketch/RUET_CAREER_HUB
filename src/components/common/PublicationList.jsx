/**
 * Renders publications with clickable links. Used on public profiles and in
 * the publications manager. `onRemove` / `onEdit` add the owner controls.
 */
export default function PublicationList({ publications = [], onRemove, onEdit, empty = 'No publications listed yet.' }) {
  if (!publications.length) return <p className="board-empty">{empty}</p>
  const sorted = [...publications].sort((a, b) => String(b.year || '').localeCompare(String(a.year || '')))
  return (
    <ul className="pub-list">
      {sorted.map((p, i) => (
        <li key={p._id || i} className="pub-item">
          <div className="pub-year">{p.year || '—'}</div>
          <div className="pub-main">
            <div className="pub-title">
              {p.link ? (
                <a href={p.link} target="_blank" rel="noreferrer noopener">{p.title} <span aria-hidden="true">↗</span></a>
              ) : (
                p.title
              )}
            </div>
            {p.authors && <div className="pub-authors">{p.authors}</div>}
            <div className="pub-venue">
              {[p.venue, p.type && p.type !== 'Other' ? p.type : ''].filter(Boolean).join(' · ')}
            </div>
            {p.link && (
              <a className="pub-link" href={p.link} target="_blank" rel="noreferrer noopener">
                {p.link.replace(/^https?:\/\//, '').slice(0, 60)}
              </a>
            )}
          </div>
          {(onEdit || onRemove) && (
            <div className="pub-actions">
              {onEdit && <button className="btn btn-ghost btn-sm" onClick={() => onEdit(p)}>Edit</button>}
              {onRemove && <button className="entry-remove" onClick={() => onRemove(p)} aria-label={`Remove ${p.title}`}>✕</button>}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
