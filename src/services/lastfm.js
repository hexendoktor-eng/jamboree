const defaultApiBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:5041'
  : `${window.location.protocol}//${window.location.hostname}:5041`

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(/\/$/, '')

export async function getRecentTracks(username) {
  const normalizedUsername = username.trim()
  const response = await fetch(`${API_BASE_URL}/api/lastfm/users/${encodeURIComponent(normalizedUsername)}/recent-tracks`)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Jamboree could not load that Last.fm profile. Try again.')
  }

  return payload
}
