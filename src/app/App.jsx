import { useMemo, useState } from 'react'
import './App.css'
import Navigation from '../components/Navigation'
import MusicCard from '../components/MusicCard/MusicCard'
import { SongList } from '../exampleSongs.js'
import { getRecentTracks } from '../services/lastfm'

const library = SongList.map((song, index) => ({
  ...song,
  id: `sample-${song.title}`,
  type: index === 1 ? 'Album' : 'Song',
  year: [2024, 2025, 1990, 2012][index],
  mood: ['Dreamy', 'Electronic', 'Euphoric', 'Warm'][index],
  plays: [18, 11, 25, 9][index],
  saved: index !== 3,
}))

const recommendations = [
  { ...library[1], friend: 'Mia', note: 'This feels like it belongs on your late-night walks playlist.', date: 'Today', color: '#ffd166' },
  { ...library[2], friend: 'Andre', note: 'A perfect album for disappearing into for forty minutes.', date: 'Yesterday', color: '#90e0ef' },
  { ...library[3], friend: 'Jo', note: 'The kind of sunny record that turns a commute around.', date: 'Aug 11', color: '#ff9f9f' },
]

function App() {
  const [activeView, setActiveView] = useState('Library')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All music')
  const [savedSongs, setSavedSongs] = useState(() => new Set(library.filter((song) => song.saved).map((song) => song.title)))
  const [importedLibrary, setImportedLibrary] = useState([])
  const [lastFmProfile, setLastFmProfile] = useState(null)
  const [isConnectOpen, setIsConnectOpen] = useState(false)
  const [lastFmUsername, setLastFmUsername] = useState('')
  const [connectionError, setConnectionError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const currentLibrary = importedLibrary.length ? importedLibrary : library

  const filteredLibrary = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return currentLibrary.filter((song) => {
      const matchesSearch = !normalizedQuery || `${song.title} ${song.artist}`.toLowerCase().includes(normalizedQuery)
      const matchesFilter = filter === 'All music' || song.type === filter
      return matchesSearch && matchesFilter
    })
  }, [currentLibrary, filter, query])

  const toggleSaved = (title) => {
    setSavedSongs((currentSongs) => {
      const nextSongs = new Set(currentSongs)
      if (nextSongs.has(title)) nextSongs.delete(title)
      else nextSongs.add(title)
      return nextSongs
    })
  }

  const openConnectDialog = () => {
    setConnectionError('')
    setIsConnectOpen(true)
  }

  const handleLastFmImport = async (event) => {
    event.preventDefault()
    if (!lastFmUsername.trim()) return

    setConnectionError('')
    setIsImporting(true)
    try {
      const profile = await getRecentTracks(lastFmUsername)
      if (!profile.tracks.length) throw new Error('No recent tracks were found for that Last.fm profile.')

      setImportedLibrary(profile.tracks)
      setLastFmProfile(profile)
      setActiveView('Library')
      setIsConnectOpen(false)
    } catch (error) {
      setConnectionError(error.message)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <main className="app-shell">
      <Navigation activeView={activeView} onChangeView={setActiveView} />

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR SOUND, ORGANIZED</p>
            <h1>Good evening, Justin.</h1>
          </div>
          <div className="profile-area">
            <button className="icon-button" aria-label="View notifications">⌁</button>
            <button className="avatar" aria-label="Open profile">J</button>
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <p className="eyebrow">FROM LAST.FM</p>
            <h2>{lastFmProfile ? `Welcome in, ${lastFmProfile.username}.` : 'Your listening story is taking shape.'}</h2>
            <p className="welcome-copy">{lastFmProfile ? `${importedLibrary.length} recent tracks are now in your library. You can search, save, and revisit them below.` : 'Add your Last.fm username to turn your public scrobbles into a collection worth revisiting.'}</p>
            <button className="primary-button" onClick={openConnectDialog}>{lastFmProfile ? 'Import another profile' : 'Add Last.fm profile'} <span>↗</span></button>
          </div>
          <div className="orbital-art" aria-hidden="true">
            <span className="orbital-ring ring-one" />
            <span className="orbital-ring ring-two" />
            <span className="orbital-note">♫</span>
            <span className="art-sticker sticker-one">♡</span>
            <span className="art-sticker sticker-two">✦</span>
          </div>
        </section>

        <section className="stat-grid" aria-label="Collection statistics">
          <div className="stat-card"><span className="stat-symbol">◌</span><div><strong>{lastFmProfile ? importedLibrary.length : '124'}</strong><span>{lastFmProfile ? 'Imported tracks' : 'Saved records'}</span></div></div>
          <div className="stat-card"><span className="stat-symbol coral">↗</span><div><strong>18</strong><span>New this month</span></div></div>
          <div className="stat-card"><span className="stat-symbol blue">♬</span><div><strong>37</strong><span>Recommendations</span></div></div>
        </section>

        <section className="collection-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{activeView === 'Home' ? 'A SMALL PIECE OF YOUR' : 'CURATED BY YOU'}</p>
              <h2>{activeView === 'Home' ? 'Recently saved' : activeView === 'Recommendations' ? 'Friend recommendations' : 'Your collection'}</h2>
            </div>
            <button className="text-button">View all <span>→</span></button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artists, songs, albums…" />
            </label>
            <div className="filter-group" aria-label="Filter collection">
              {['All music', 'Song', 'Album'].map((filterName) => (
                <button key={filterName} className={filter === filterName ? 'filter active' : 'filter'} onClick={() => setFilter(filterName)}>{filterName}</button>
              ))}
            </div>
          </div>

          {activeView === 'Recommendations' ? (
            <div className="recommendation-list">
              {recommendations.filter((song) => !query || `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase())).map((recommendation) => (
                <article className="recommendation" key={recommendation.title}>
                  <img src={recommendation.image} alt={`${recommendation.title} cover`} />
                  <div className="recommendation-info"><span className="avatar friend-avatar" style={{ background: recommendation.color }}>{recommendation.friend[0]}</span><p><b>{recommendation.friend}</b> recommended <b>{recommendation.title}</b> · {recommendation.artist}</p><span>{recommendation.note}</span></div>
                  <time>{recommendation.date}</time>
                  <button className="save-button" onClick={() => toggleSaved(recommendation.title)} aria-label={`Save ${recommendation.title}`}>{savedSongs.has(recommendation.title) ? 'Saved' : 'Save'}</button>
                </article>
              ))}
            </div>
          ) : (
            <div className="music-grid">
              {filteredLibrary.map((song) => <MusicCard key={song.id} {...song} isSaved={savedSongs.has(song.title)} onToggleSaved={() => toggleSaved(song.title)} />)}
            </div>
          )}

          {!filteredLibrary.length && activeView !== 'Recommendations' && <p className="empty-state">Nothing in your collection matches that search yet.</p>}
        </section>

        <section className="recommendations-preview">
          <div className="section-heading"><div><p className="eyebrow">FOR YOUR EARS</p><h2>Waiting in the wings</h2></div><button className="text-button" onClick={() => setActiveView('Recommendations')}>See recommendations <span>→</span></button></div>
          <div className="friend-pills">
            {recommendations.map((recommendation) => <div className="friend-pill" key={recommendation.friend}><span className="avatar friend-avatar" style={{ background: recommendation.color }}>{recommendation.friend[0]}</span><span><b>{recommendation.friend}</b><small>sent you a recommendation</small></span><img src={recommendation.image} alt="" /></div>)}
          </div>
        </section>

        {isConnectOpen && (
          <div className="dialog-backdrop" role="presentation" onMouseDown={() => !isImporting && setIsConnectOpen(false)}>
            <section className="connect-dialog" aria-modal="true" aria-labelledby="lastfm-dialog-title" role="dialog" onMouseDown={(event) => event.stopPropagation()}>
              <button className="dialog-close" aria-label="Close" disabled={isImporting} onClick={() => setIsConnectOpen(false)}>×</button>
              <p className="eyebrow">PUBLIC PROFILE IMPORT</p>
              <h2 id="lastfm-dialog-title">Add your Last.fm username</h2>
              <p>We’ll import your 50 most recent public scrobbles. No password or Last.fm login is needed.</p>
              <form onSubmit={handleLastFmImport}>
                <label htmlFor="lastfm-username">Last.fm username</label>
                <input autoFocus id="lastfm-username" onChange={(event) => setLastFmUsername(event.target.value)} placeholder="e.g. justin" required value={lastFmUsername} />
                {connectionError && <p className="form-error" role="alert">{connectionError}</p>}
                <button className="primary-button" disabled={isImporting} type="submit">{isImporting ? 'Importing…' : 'Import recent tracks'} <span>↗</span></button>
              </form>
              <p className="dialog-note">You’ll need a Last.fm API key in <code>.env.local</code>. The app’s README explains the one-line setup.</p>
            </section>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
