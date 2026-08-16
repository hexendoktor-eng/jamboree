import { useState } from 'react'

export default function MusicCard({ image, title, artist, type, year, mood, plays, isSaved, onToggleSaved }) {
  const [hasMissingCover, setHasMissingCover] = useState(!image)

  return (
    <article className="music-card">
      <div className="cover-wrap">
        {hasMissingCover ? (
          <div className="cover-placeholder" aria-label={`No cover art available for ${title}`} role="img"><span>♪</span><small>{artist}</small></div>
        ) : (
          <img src={image} alt={`${title} cover`} onError={() => setHasMissingCover(true)} />
        )}
        <button className={isSaved ? 'heart saved' : 'heart'} onClick={onToggleSaved} aria-label={`${isSaved ? 'Remove' : 'Save'} ${title}`}>{isSaved ? '♥' : '♡'}</button><span className="format-tag">{type}</span>
      </div>
      <div className="card-copy"><div><h3>{title}</h3><p>{artist}</p></div><span className="year">{year}</span></div>
      <div className="card-meta"><span>{mood}</span><span>{plays} plays</span></div>
    </article>
  )
}
