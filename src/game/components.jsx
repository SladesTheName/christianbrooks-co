const AVATAR_COLORS = ['#e8553d', '#1fa88c', '#f2b33d', '#7c5cbf', '#3d7be8', '#d1567a', '#5a9e3d']

function colorFor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Avatar({ person }) {
  if (person.photo) {
    return <img className="person-photo" src={person.photo} alt="" />
  }
  return (
    <div className="person-initials" style={{ background: colorFor(person.name || '?') }}>
      {initials(person.name || '?')}
    </div>
  )
}

export function PersonCard({ person, eliminated, selected, onClick, children }) {
  const cls = [
    'person-card',
    eliminated ? 'eliminated' : '',
    selected ? 'selected' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} onClick={onClick} aria-pressed={selected || eliminated || undefined}>
      <Avatar person={person} />
      <div className="person-name">{person.nickname || person.name}</div>
      {children}
    </button>
  )
}

export function TopBar({ title, onBack, right }) {
  return (
    <div className="topbar">
      {onBack && (
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
      )}
      <h1>{title}</h1>
      {right}
    </div>
  )
}

export function Sheet({ title, onClose, children }) {
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  )
}

export function Toggle({ on, onChange, label, sub }) {
  return (
    <button type="button" className="toggle-row" onClick={() => onChange(!on)}>
      <div style={{ textAlign: 'left' }}>
        <div className="t-label">{label}</div>
        {sub && <div className="t-sub">{sub}</div>}
      </div>
      <span className={`switch${on ? ' on' : ''}`} />
    </button>
  )
}
