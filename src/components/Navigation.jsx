const navItems = [
  { label: 'Home', view: 'Home' },
  { label: 'New music', view: 'Library' },
  { label: 'Reviews', view: 'Recommendations' },
]

export default function Navigation({ activeView, onChangeView, query, onChangeQuery }) {
  const handleSearchSubmit = (event) => {
    event.preventDefault()
    onChangeView('Library')
  }

  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => onChangeView('Home')} aria-label="Jamboree home">
        <span>Jamboree</span>
        <small>Personal catalogue</small>
      </button>
      <span className="header-divider" aria-hidden="true" />
      <nav className="primary-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button className={activeView === item.view ? 'header-nav-link active' : 'header-nav-link'} key={item.view} onClick={() => onChangeView(item.view)}>{item.label}</button>
        ))}
      </nav>
      <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => onChangeQuery(event.target.value)} placeholder="Search releases, artists, friends…" aria-label="Search Jamboree" />
      </form>
      <button className="avatar" aria-label="Open profile">J</button>
    </header>
  )
}
