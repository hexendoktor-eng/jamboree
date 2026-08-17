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
  { ...library[1], friend: 'Mia', note: 'This feels like it belongs on your late-night walks playlist.', date: 'Today' },
  { ...library[2], friend: 'Andre', note: 'A perfect album for disappearing into for forty minutes.', date: 'Yesterday' },
  { ...library[3], friend: 'Jo', note: 'The kind of sunny record that turns a commute around.', date: 'Aug 11' },
]

function RecommendationRow({ index, recommendation, isSaved, onToggleSaved }) {
  return (
    <article className="recommend-row">
      <span className="recommend-index">{String(index + 1).padStart(2, '0')}</span>
      <img className="recommend-thumb" src={recommendation.image} alt={`${recommendation.title} cover`} />
      <p className="recommend-copy">
        <span className="recommend-initial">{recommendation.friend[0]}</span>
        <b>{recommendation.friend}</b> — {recommendation.title}, {recommendation.artist}. <i className="recommend-note">"{recommendation.note}"</i>
      </p>
      <span className="recommend-date">{recommendation.date}</span>
      <button className={isSaved ? 'recommend-save is-saved' : 'recommend-save'} onClick={onToggleSaved} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${recommendation.title}`}>{isSaved ? 'SAVED' : 'SAVE'}</button>
    </article>
  )
}

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

  const filteredRecommendations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return recommendations.filter((song) => !normalizedQuery || `${song.title} ${song.artist}`.toLowerCase().includes(normalizedQuery))
  }, [query])

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
            <p className="eyebrow">VOL. III — YOUR SOUND, ORGANIZED</p>
            <h1>Good evening, Justin.</h1>
          </div>
          <button className="avatar" aria-label="Open profile">J</button>
        </header>

        <section className="lastfm-card">
          <div>
            <p className="lastfm-label">SOURCE: LAST.FM — {lastFmProfile ? 'CONNECTED' : 'NOT CONNECTED'}</p>
            {lastFmProfile ? (
              <div className="lastfm-fields">
                <div><div className="lastfm-field-label">USERNAME</div>{lastFmProfile.username}</div>
                <div><div className="lastfm-field-label">SCROBBLES</div>{importedLibrary.length} synced</div>
                <div><div className="lastfm-field-label">LAST SYNC</div>Just now</div>
              </div>
            ) : (
              <p className="lastfm-copy">Add a public Last.fm username to start your catalogue.</p>
            )}
          </div>
          <button className="btn-outline" onClick={openConnectDialog}>{lastFmProfile ? 'Import another profile' : 'Add Last.fm profile'} →</button>
        </section>

        <section className="stat-grid" aria-label="Collection statistics">
          <div className="stat-cell">
            <div className="stat-value">{lastFmProfile ? importedLibrary.length : 124}</div>
            <div className="stat-label">{lastFmProfile ? 'IMPORTED TRACKS' : 'SAVED RECORDS'}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value accent-green">18</div>
            <div className="stat-label">NEW THIS MONTH</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value accent-plum">37</div>
            <div className="stat-label">RECOMMENDATIONS</div>
          </div>
        </section>

        <section className="collection-section">
          <div className="section-heading">
            <h2>{activeView === 'Home' ? 'Recently saved' : activeView === 'Recommendations' ? 'Friend recommendations' : 'Your collection'}</h2>
            <button className="text-link">VIEW ALL →</button>
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
            <div className="recommend-list">
              {filteredRecommendations.map((recommendation, index) => (
                <RecommendationRow key={recommendation.title} index={index} recommendation={recommendation} isSaved={savedSongs.has(recommendation.title)} onToggleSaved={() => toggleSaved(recommendation.title)} />
              ))}
              {!filteredRecommendations.length && <p className="empty-state">Nothing in your recommendations matches that search yet.</p>}
            </div>
          ) : (
            <div className="music-grid">
              {filteredLibrary.map((song, index) => <MusicCard key={song.id} {...song} index={index} isSaved={savedSongs.has(song.title)} onToggleSaved={() => toggleSaved(song.title)} />)}
            </div>
          )}

          {!filteredLibrary.length && activeView !== 'Recommendations' && <p className="empty-state">Nothing in your collection matches that search yet.</p>}
        </section>

        {activeView !== 'Recommendations' && (
          <section className="recommend-section">
            <div className="section-heading recommend-heading">
              <h2>Recommended to you</h2>
              <button className="text-link" onClick={() => setActiveView('Recommendations')}>SEE ALL →</button>
            </div>
            <div className="recommend-list">
              {recommendations.map((recommendation, index) => (
                <RecommendationRow key={recommendation.title} index={index} recommendation={recommendation} isSaved={savedSongs.has(recommendation.title)} onToggleSaved={() => toggleSaved(recommendation.title)} />
              ))}
            </div>
          </section>
        )}

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
                <button className="btn-outline" disabled={isImporting} type="submit">{isImporting ? 'Importing…' : 'Import recent tracks'} →</button>
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
