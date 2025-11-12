import React from 'react'
export default function PlayerDeck({ current, onPlay, onPause, onNext }){
  return (
    <div className="panel player-deck glass">
      <div className="now-playing">
        <div className="cover-sim"></div>
        <div>
          <div className="label">Reproduciendo</div>
          <div className="title">{current?.title || '—'}</div>
        </div>
      </div>
      <div className="player-controls">
        <button onClick={onPlay}>▶︎</button>
        <button onClick={onPause}>⏸</button>
        <button onClick={onNext}>⏭</button>
      </div>
    </div>
  )
}
