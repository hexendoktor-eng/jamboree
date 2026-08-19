import { useMemo, useState } from 'react'
import './App.css'
import Navigation from '../components/Navigation'
import MusicCard from '../components/MusicCard/MusicCard'
import SoundCloudTest from '../components/SoundCloudTest/SoundCloudTest'
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
  { ...library[0], friend: 'Mia', note: 'This feels like it belongs on your late-night walks playlist.', date: 'Today' },
  { ...library[2], friend: 'Andre', note: 'A perfect album for disappearing into for forty minutes.', date: 'Yesterday' },
  { ...library[3], friend: 'Jo', note: 'The kind of sunny record that turns a commute around.', date: 'Aug 11' },
]

const catalogueStats = [
  { value: '312,884', label: 'Artists' },
  { value: '1,204,761', label: 'Releases' },
  { value: '9,418,552', label: 'Ratings', accent: 'gold' },
  { value: '184,096', label: 'Reviews', accent: 'red' },
  { value: '47,330', label: 'Lists' },
]

const histogram = [
  { score: 5, width: '58%', color: 'gold' },
  { score: 4, width: '74%', color: 'red' },
  { score: 3, width: '31%', color: 'royal' },
  { score: 2, width: '12%', color: 'inert' },
  { score: 1, width: '5%', color: 'inert' },
]

function SocialLinks() {
  const links = [
    { id: 'bluesky-icon', label: 'Bluesky' },
    { id: 'x-icon', label: 'X' },
    { id: 'discord-icon', label: 'Discord' },
    { id: 'github-icon', label: 'GitHub' },
  ]

  return (
    <div className="follow-cluster" aria-label="Follow Jamboree">
      <span>Follow</span>
      {links.map((link) => (
        <a className="social-chip" href={`https://${link.label.toLowerCase()}.com`} key={link.id} target="_blank" rel="noreferrer" aria-label={`Follow Jamboree on ${link.label}`}>
          <svg aria-hidden="true"><use href={`/icons.svg#${link.id}`} /></svg>
        </a>
      ))}
    </div>
  )
}

function CatalogueStats({ importedCount = 0 }) {
  const stats = importedCount
    ? catalogueStats.map((stat, index) => index === 1 ? { ...stat, value: importedCount.toLocaleString(), label: 'Imported tracks' } : stat)
    : catalogueStats

  return (
    <section className="catalogue-stats" aria-label="Jamboree catalogue statistics">
      {stats.map((stat) => (
        <div className="catalogue-stat" key={stat.label}>
          <div className={`catalogue-stat-value${stat.accent ? ` accent-${stat.accent}` : ''}`}>{stat.value}</div>
          <div className="catalogue-stat-label">{stat.label}</div>
        </div>
      ))}
    </section>
  )
}

function RecommendationRow({ index, recommendation, isSaved, onToggleSaved }) {
  return (
    <article className="recommend-row">
      <span className="recommend-index">{String(index + 1).padStart(2, '0')}</span>
      <img className="recommend-thumb" src={recommendation.image} alt={`${recommendation.title} cover`} />
      <div className="recommend-copy">
        <p className="recommend-title"><span className="recommend-initial">{recommendation.friend[0]}</span><b>{recommendation.friend}</b> recommends <span>{recommendation.title}</span> <em>by {recommendation.artist}</em></p>
        <p className="recommend-note">“{recommendation.note}”</p>
      </div>
      <span className="recommend-date">{recommendation.date}</span>
      <button className={isSaved ? 'recommend-save is-saved' : 'recommend-save'} onClick={onToggleSaved} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${recommendation.title}`}>{isSaved ? 'Saved' : 'Save'}</button>
    </article>
  )
}

function FeaturedReviews({ isSaved, onToggleSaved, onViewReviews }) {
  return (
    <section className="featured-reviews" id="featured-reviews">
      <div className="section-heading">
        <h2>Featured reviews</h2>
        <button className="text-link" onClick={onViewReviews}>All reviews →</button>
      </div>

      <article className="featured-card">
        <header className="featured-card-header">
          <span>Anniversary listens</span>
          <span className="review-badge">Review</span>
        </header>
        <div className="featured-card-body">
          <div className="featured-release-rail">
            <img className="featured-cover" src={library[2].image} alt="Heaven or Las Vegas cover" />
            <div className="score-line"><strong>4.12</strong><span>from 16,933 ratings</span></div>
            <div className="genre-block">
              <span className="micro-label">Genres</span>
              <div className="genre-list"><span>Dream Pop</span><span>Ethereal Wave</span><span>Alternative</span></div>
            </div>
            <div className="rating-histogram" aria-label="Rating distribution">
              {histogram.map((bucket) => (
                <div className="histogram-row" key={bucket.score}>
                  <span>{bucket.score}</span>
                  <i className={`bar-${bucket.color}`} style={{ width: bucket.width }} />
                </div>
              ))}
            </div>
          </div>

          <div className="featured-review-copy">
            <h3>Heaven or Las Vegas <span>(1990)</span></h3>
            <p className="featured-artist">Cocteau Twins</p>
            <div className="review-byline">
              <span className="reviewer-avatar">M</span>
              <span>Review by <b>Mia</b></span>
              <span className="stars" aria-label="Five stars">★★★★★</span>
            </div>
            <p>The record everyone reaches for when they want to explain what “atmosphere” means, and it earns that shortcut. The guitars are enormous but never heavy, the vocals sit just far enough back to read as weather rather than speech, and the whole thing keeps moving even when nothing in it is in a hurry.</p>
            <p>What holds up after thirty-five years is the restraint. Every song could have gone bigger and none of them do. It stays in the room with you instead of performing at you, which is why it survives the commute, the late night, and the fifth relisten in a week.</p>
            <footer className="review-footer">
              <span>142 likes</span>
              <span>28 comments</span>
              <button onClick={onToggleSaved}>{isSaved ? 'Saved to library ✓' : 'Save this release →'}</button>
            </footer>
          </div>
        </div>
      </article>

      <div className="secondary-reviews">
        <article className="secondary-review">
          <img src={library[0].image} alt="Death & Romance cover" />
          <div><h3>Death &amp; Romance</h3><p>Magdalena Bay · 2024</p><strong>3.94 <span>· 4,102 ratings</span></strong></div>
        </article>
        <article className="secondary-review">
          <img src={library[3].image} alt="Sweet Life cover" />
          <div><h3>Sweet Life</h3><p>Frank Ocean · 2012</p><strong>4.31 <span>· 22,760 ratings</span></strong></div>
        </article>
      </div>
    </section>
  )
}

function relativeTime(playedAt, index) {
  if (!playedAt) return index === 0 ? 'Now' : 'Recent'
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - playedAt) / 60000))
  if (elapsedMinutes < 60) return `${elapsedMinutes}m`
  if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)}h`
  return `${Math.floor(elapsedMinutes / 1440)}d`
}

function StreamingPanel({ profile, tracks, onConnect }) {
  const currentTrack = tracks[0]
  const isConnected = Boolean(profile && currentTrack)

  return (
    <aside className="streaming-panel" aria-label="Last.fm listening activity">
      <div className="section-heading streaming-heading">
        <h2>Currently streaming</h2>
        <span className={isConnected ? 'connection-chip is-live' : 'connection-chip'}><i />{isConnected ? 'Live' : 'Offline'}</span>
      </div>

      <div className="now-playing-card">
        {isConnected && currentTrack.image ? (
          <img className="now-playing-art" src={currentTrack.image} alt={`${currentTrack.title} cover`} />
        ) : (
          <div className="now-playing-placeholder"><span>Now playing artwork · 360×300</span><small>Filled from Last.fm on connect</small></div>
        )}
        <div className="now-playing-meta">
          <p className={isConnected ? 'stream-source is-connected' : 'stream-source'}>Source: Last.fm — {isConnected ? `connected as ${profile.username}` : 'not connected'}</p>
          {isConnected ? (
            <>
              <h3>{currentTrack.title}</h3>
              <p className="now-playing-artist">{currentTrack.artist}</p>
              <div className="progress-track"><span className={currentTrack.mood === 'Playing now' ? 'is-playing' : ''} /></div>
              <div className="progress-labels"><span>{currentTrack.mood === 'Playing now' ? 'Listening now' : 'Latest scrobble'}</span><span>Last.fm</span></div>
            </>
          ) : (
            <>
              <span className="skeleton-line skeleton-track" /><span className="skeleton-line skeleton-artist" />
              <div className="progress-track"><span /></div><div className="progress-labels"><span>--:--</span><span>--:--</span></div>
            </>
          )}
        </div>
      </div>

      <button className="connect-cta" onClick={onConnect}>{isConnected ? 'Import another Last.fm profile' : 'Add Last.fm profile'} →</button>
      <p className="stream-helper">{isConnected ? `Showing the latest public scrobbles from ${profile.username}.` : 'Add a public Last.fm username to stream your scrobbles into this panel. No password needed.'}</p>

      <section className="recent-scrobbles">
        <h3>Recent scrobbles</h3>
        <div className="scrobble-list">
          {isConnected ? tracks.slice(0, 4).map((track, index) => (
            <article className="scrobble-row" key={track.id}>
              {track.image ? <img src={track.image} alt="" /> : <span className="scrobble-art-placeholder" />}
              <div><strong>{track.title}</strong><span>{track.artist}</span></div>
              <time>{relativeTime(track.playedAt, index)}</time>
            </article>
          )) : Array.from({ length: 4 }, (_, index) => (
            <div className="scrobble-row is-skeleton" key={index}>
              <span className="scrobble-art-placeholder" />
              <span className="scrobble-lines"><i style={{ width: `${70 - index * 7}%` }} /><i style={{ width: `${42 + index * 2}%` }} /></span>
              <time>--</time>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

function HomeView({ importedLibrary, lastFmProfile, savedSongs, onConnect, onToggleSaved, onViewRecommendations }) {
  return (
    <>
      <section className="hero-row">
        <div>
          <h1>A catalogue built by people who keep listening.</h1>
          <p>Jamboree indexes the music worth remembering — rate what you hear, write it up, and follow the people whose taste you trust. <button onClick={onViewRecommendations}>Start with the week’s featured reviews.</button></p>
        </div>
        <SocialLinks />
      </section>
      <CatalogueStats importedCount={importedLibrary.length} />
      <div className="home-body">
        <FeaturedReviews isSaved={savedSongs.has(library[2].title)} onToggleSaved={() => onToggleSaved(library[2].title)} onViewReviews={onViewRecommendations} />
        <StreamingPanel profile={lastFmProfile} tracks={importedLibrary} onConnect={onConnect} />
      </div>
    </>
  )
}

function CollectionView({ activeView, filter, filteredLibrary, filteredRecommendations, onFilter, onToggleSaved, savedSongs }) {
  const isRecommendationsView = activeView === 'Recommendations'

  return (
    <section className={isRecommendationsView ? 'catalogue-page recommendations-page' : 'catalogue-page'}>
      <header className="view-heading">
        <p>{isRecommendationsView ? 'From people who know your taste' : 'Your listening history, indexed'}</p>
        <h1>{isRecommendationsView ? 'Friend recommendations' : 'Your collection'}</h1>
      </header>

      <div className="collection-section">
        <div className="section-heading collection-heading">
          <h2>{isRecommendationsView ? 'A short list, worth your time' : `${filteredLibrary.length} records`}</h2>
          {!isRecommendationsView && <div className="filter-group" aria-label="Filter collection">
            {['All music', 'Song', 'Album'].map((filterName) => (
              <button key={filterName} className={filter === filterName ? 'filter active' : 'filter'} onClick={() => onFilter(filterName)}>{filterName}</button>
            ))}
          </div>}
        </div>

        {isRecommendationsView ? (
          <div className="recommend-list">
            {filteredRecommendations.map((recommendation, index) => (
              <RecommendationRow key={recommendation.title} index={index} recommendation={recommendation} isSaved={savedSongs.has(recommendation.title)} onToggleSaved={() => onToggleSaved(recommendation.title)} />
            ))}
            {!filteredRecommendations.length && <p className="empty-state">Nothing in your recommendations matches that search yet.</p>}
          </div>
        ) : (
          <>
            <div className="music-grid">
              {filteredLibrary.map((song, index) => <MusicCard key={song.id} {...song} index={index} isSaved={savedSongs.has(song.title)} onToggleSaved={() => onToggleSaved(song.title)} />)}
            </div>
            {!filteredLibrary.length && <p className="empty-state">Nothing in your collection matches that search yet.</p>}
          </>
        )}
      </div>
    </section>
  )
}

function App() {
  const [activeView, setActiveView] = useState('Home')
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
    return recommendations.filter((song) => !normalizedQuery || `${song.title} ${song.artist} ${song.friend}`.toLowerCase().includes(normalizedQuery))
  }, [query])

  const toggleSaved = (title) => {
    setSavedSongs((currentSongs) => {
      const nextSongs = new Set(currentSongs)
      if (nextSongs.has(title)) nextSongs.delete(title)
      else nextSongs.add(title)
      return nextSongs
    })
  }

  const changeView = (nextView) => {
    setActiveView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      setIsConnectOpen(false)
    } catch (error) {
      setConnectionError(error.message)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <main className="app-shell">
      <Navigation activeView={activeView} onChangeView={changeView} query={query} onChangeQuery={setQuery} />

      {activeView === 'Home' ? (
        <HomeView importedLibrary={importedLibrary} lastFmProfile={lastFmProfile} savedSongs={savedSongs} onConnect={openConnectDialog} onToggleSaved={toggleSaved} onViewRecommendations={() => changeView('Recommendations')} />
      ) : activeView === 'SoundCloud' ? (
        <SoundCloudTest />
      ) : (
        <CollectionView activeView={activeView} filter={filter} filteredLibrary={filteredLibrary} filteredRecommendations={filteredRecommendations} onFilter={setFilter} onToggleSaved={toggleSaved} savedSongs={savedSongs} />
      )}

      {isConnectOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => !isImporting && setIsConnectOpen(false)}>
          <section className="connect-dialog" aria-modal="true" aria-labelledby="lastfm-dialog-title" role="dialog" onMouseDown={(event) => event.stopPropagation()}>
            <button className="dialog-close" aria-label="Close" disabled={isImporting} onClick={() => setIsConnectOpen(false)}>×</button>
            <p className="eyebrow">Public profile import</p>
            <h2 id="lastfm-dialog-title">Add your Last.fm username</h2>
            <p>We’ll import your 50 most recent public scrobbles. No password or Last.fm login is needed.</p>
            <form onSubmit={handleLastFmImport}>
              <label htmlFor="lastfm-username">Last.fm username</label>
              <input autoFocus id="lastfm-username" onChange={(event) => setLastFmUsername(event.target.value)} placeholder="e.g. justin" required value={lastFmUsername} />
              {connectionError && <p className="form-error" role="alert">{connectionError}</p>}
              <button className="dialog-submit" disabled={isImporting} type="submit">{isImporting ? 'Importing…' : 'Import recent tracks'} →</button>
            </form>
            <p className="dialog-note">The Last.fm API key stays in your private C# backend and is never sent to this browser.</p>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
