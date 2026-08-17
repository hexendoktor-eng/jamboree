const navItems = ['Home', 'Library', 'Recommendations']

export default function Navigation({ activeView, onChangeView }) {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="brand-block">
        <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); onChangeView('Home') }}>Jamboree</a>
        <p className="brand-sub">PERSONAL CATALOGUE</p>
      </div>

      <div className="sidebar-nav">
        {navItems.map((label, index) => (
          <button key={label} className={activeView === label ? 'nav-link active' : 'nav-link'} onClick={() => onChangeView(label)}>
            <span className="nav-num">{String(index + 1).padStart(2, '0')}</span>
            <span className="nav-label"> — {label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="nav-link">
          <span className="nav-num">04</span>
          <span className="nav-label"> — Settings</span>
        </button>
        <p className="sidebar-tagline">Est. 2026 · a private index of the music worth remembering.</p>
      </div>
    </nav>
  )
}
