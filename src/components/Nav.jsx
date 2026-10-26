export default function Nav({ tabs, active, onChange }) {
  return (
    <nav className="chnk-nav">
      {tabs.map(t => (
        <button key={t.id}
          className={'chnk-nav__item' + (active === t.id ? ' is-active' : '')}
          onClick={() => onChange(t.id)}>
          <span className="chnk-nav__icon">{t.icon}</span>
          <span className="chnk-nav__label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
