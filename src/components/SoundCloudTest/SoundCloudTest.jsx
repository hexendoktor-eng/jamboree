import { useEffect, useMemo, useRef, useState } from 'react'

const WIDGET_API_URL = 'https://w.soundcloud.com/player/api.js'
let widgetApiPromise

function loadWidgetApi() {
  if (window.SC?.Widget) return Promise.resolve(window.SC)
  if (widgetApiPromise) return widgetApiPromise

  widgetApiPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${WIDGET_API_URL}"]`)
    const script = existingScript || document.createElement('script')

    const handleLoad = () => resolve(window.SC)
    const handleError = () => reject(new Error('SoundCloud’s player controls could not be loaded.'))

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    if (!existingScript) {
      script.src = WIDGET_API_URL
      script.async = true
      document.head.appendChild(script)
    }
  })

  return widgetApiPromise
}

function normalizeSoundCloudUrl(value) {
  const url = new URL(value.trim())
  const hostname = url.hostname.toLowerCase()

  if (!['http:', 'https:'].includes(url.protocol) ||
      (hostname !== 'soundcloud.com' && !hostname.endsWith('.soundcloud.com'))) {
    throw new Error('Paste a public SoundCloud track URL, such as https://soundcloud.com/artist/track.')
  }

  url.protocol = 'https:'
  return url.toString()
}

function buildWidgetUrl(trackUrl) {
  const parameters = new URLSearchParams({
    url: trackUrl,
    color: '#f2c230',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: 'false',
  })

  return `https://w.soundcloud.com/player/?${parameters}`
}

export default function SoundCloudTest() {
  const iframeRef = useRef(null)
  const widgetRef = useRef(null)
  const volumeRef = useRef(80)
  const [inputUrl, setInputUrl] = useState('')
  const [loadedUrl, setLoadedUrl] = useState('')
  const [formError, setFormError] = useState('')
  const [playerStatus, setPlayerStatus] = useState('idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [trackInfo, setTrackInfo] = useState(null)
  const widgetUrl = useMemo(() => loadedUrl ? buildWidgetUrl(loadedUrl) : '', [loadedUrl])

  useEffect(() => {
    if (!loadedUrl || !iframeRef.current) return undefined

    let isCancelled = false
    let widget
    setPlayerStatus('loading')
    setIsPlaying(false)
    setTrackInfo(null)

    loadWidgetApi()
      .then((soundCloud) => {
        if (isCancelled || !soundCloud?.Widget || !iframeRef.current) return

        widget = soundCloud.Widget(iframeRef.current)
        widgetRef.current = widget
        const events = soundCloud.Widget.Events

        widget.bind(events.READY, () => {
          if (isCancelled) return
          widget.setVolume(volumeRef.current)
          setPlayerStatus('ready')
          widget.getCurrentSound((sound) => {
            if (!isCancelled && sound) {
              setTrackInfo({
                title: sound.title,
                artist: sound.user?.username || 'SoundCloud artist',
              })
            }
          })
        })
        widget.bind(events.PLAY, () => !isCancelled && setIsPlaying(true))
        widget.bind(events.PAUSE, () => !isCancelled && setIsPlaying(false))
        widget.bind(events.FINISH, () => !isCancelled && setIsPlaying(false))
        widget.bind(events.ERROR, () => !isCancelled && setPlayerStatus('error'))
      })
      .catch(() => !isCancelled && setPlayerStatus('error'))

    return () => {
      isCancelled = true
      widgetRef.current = null

      if (widget && window.SC?.Widget?.Events) {
        Object.values(window.SC.Widget.Events).forEach((eventName) => widget.unbind(eventName))
      }
    }
  }, [loadedUrl])

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    try {
      setLoadedUrl(normalizeSoundCloudUrl(inputUrl))
    } catch {
      setFormError('Paste a public SoundCloud track URL, such as https://soundcloud.com/artist/track.')
    }
  }

  const togglePlayback = () => {
    if (playerStatus !== 'ready') return
    widgetRef.current?.toggle()
  }

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    volumeRef.current = nextVolume
    setVolume(nextVolume)
    widgetRef.current?.setVolume(nextVolume)
  }

  const clearPlayer = () => {
    widgetRef.current?.pause()
    setLoadedUrl('')
    setInputUrl('')
    setFormError('')
    setPlayerStatus('idle')
    setTrackInfo(null)
    setIsPlaying(false)
  }

  return (
    <section className="catalogue-page soundcloud-page">
      <header className="view-heading">
        <p>Public playback sandbox</p>
        <h1>SoundCloud Test</h1>
      </header>

      <div className="soundcloud-layout">
        <section className="soundcloud-workbench">
          <div className="soundcloud-intro">
            <span className="soundcloud-mark" aria-hidden="true">SC</span>
            <div>
              <p className="eyebrow">SoundCloud Widget API</p>
              <h2>Play a public track inside Jamboree</h2>
              <p>Paste a public SoundCloud track link. The official embedded player handles the audio while Jamboree controls play and pause from this page.</p>
            </div>
          </div>

          <form className="soundcloud-form" onSubmit={handleSubmit}>
            <label htmlFor="soundcloud-track-url">Public SoundCloud track URL</label>
            <div className="soundcloud-input-row">
              <input
                id="soundcloud-track-url"
                onChange={(event) => setInputUrl(event.target.value)}
                placeholder="https://soundcloud.com/artist/track"
                type="url"
                value={inputUrl}
              />
              <button type="submit">Load track →</button>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
          </form>

          {loadedUrl ? (
            <div className="soundcloud-player-shell">
              <div className="soundcloud-player-toolbar">
                <div>
                  <span className={`soundcloud-status is-${playerStatus}`}><i />{playerStatus === 'ready' ? 'Connected' : playerStatus === 'error' ? 'Player error' : 'Connecting'}</span>
                  <strong>{trackInfo?.title || 'Loading track details…'}</strong>
                  <small>{trackInfo?.artist || 'SoundCloud'}</small>
                </div>
                <div className="soundcloud-actions">
                  <label className="soundcloud-volume">
                    <span>Volume {volume}%</span>
                    <input
                      aria-label="SoundCloud player volume"
                      disabled={playerStatus !== 'ready'}
                      max="100"
                      min="0"
                      onChange={handleVolumeChange}
                      step="1"
                      type="range"
                      value={volume}
                    />
                  </label>
                  <button disabled={playerStatus !== 'ready'} onClick={togglePlayback} type="button">{isPlaying ? 'Pause' : 'Play'}</button>
                  <button className="is-muted" onClick={clearPlayer} type="button">Clear</button>
                </div>
              </div>
              <iframe
                allow="autoplay"
                className="soundcloud-widget"
                ref={iframeRef}
                src={widgetUrl}
                title="SoundCloud track player"
              />
              {playerStatus === 'error' && <p className="soundcloud-player-error" role="alert">This track could not be embedded. Check that it is public and allows playback outside SoundCloud.</p>}
            </div>
          ) : (
            <div className="soundcloud-empty-player">
              <span className="soundcloud-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <strong>No track loaded</strong>
              <p>A SoundCloud player will appear here after you add a public track URL.</p>
            </div>
          )}
        </section>

        <aside className="soundcloud-notes">
          <p className="eyebrow">What this test proves</p>
          <h2>Playback first, catalogue later.</h2>
          <ol>
            <li><span>01</span><p><strong>Public URL in</strong>The link is validated before a player is created.</p></li>
            <li><span>02</span><p><strong>SoundCloud player</strong>Audio stays in SoundCloud’s official embedded widget.</p></li>
            <li><span>03</span><p><strong>Jamboree controls</strong>Play, pause, and status events run through the Widget API.</p></li>
          </ol>
          <p className="soundcloud-privacy">This test does not need your SoundCloud password, client ID, or client secret. Private tracks and tracks with disabled embeds will not play.</p>
          <a href="https://developers.soundcloud.com/docs/api/html5-widget" rel="noreferrer" target="_blank">Read the SoundCloud Widget API docs ↗</a>
        </aside>
      </div>
    </section>
  )
}
