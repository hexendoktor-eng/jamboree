import { useState } from 'react'
import './MusicCard.css'

export default function MusicCard({ index, image, title, artist, mood, plays, isSaved, onToggleSaved }) {
  const [hasMissingCover, setHasMissingCover] = useState(!image)
  const isGreen = index % 2 === 0
  const catalogueNumber = String(index + 1).padStart(3, '0')

  return (
    <article className="music-card">
      <div className="cover-wrap">
        {hasMissingCover ? (
          <div className={isGreen ? 'cover-placeholder cover-placeholder--green' : 'cover-placeholder cover-placeholder--plum'} role="img" aria-label={`No cover art available for ${title}`}>
            <span className="cover-diamond" />
            <span className="cover-placeholder-artist">{artist}</span>
          </div>
        ) : (
          <img src={image} alt={`${title} cover`} onError={() => setHasMissingCover(true)} />
        )}
        <span className="catalogue-chip">No. {catalogueNumber}</span>
        <span className={isGreen ? 'classification-bar bar-green' : 'classification-bar bar-plum'} />
      </div>
      <h3>{title}</h3>
      <p className="track-artist">{artist}</p>
      <div className="track-meta">
        <span className="track-mood">{mood}</span>
        <span className="track-meta-right">
          <span className="track-plays">{plays} plays</span>
          <button className={isSaved ? 'track-save is-saved' : 'track-save'} onClick={onToggleSaved} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${title}`}>{isSaved ? 'SAVED' : 'SAVE'}</button>
        </span>
      </div>
    </article>
  )
}
