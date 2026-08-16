const navItems = [
  { label: 'Home', icon: '⌂' },
  { label: 'Library', icon: '♫' },
  { label: 'Recommendations', icon: '♡' },
]

export default function Navigation({ activeView, onChangeView }) {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); onChangeView('Home') }}><span>j</span> jamboree</a>
      <div className="nav-links">
        {navItems.map((item) => <button key={item.label} className={activeView === item.label ? 'nav-link active' : 'nav-link'} onClick={() => onChangeView(item.label)}><span>{item.icon}</span>{item.label}</button>)}
      </div>
      <div className="sidebar-bottom">
        <button className="nav-link"><span>⌘</span>Settings</button>
        <p>made for the music<br />you want to remember</p>
      </div>
    </nav>
  )
}
