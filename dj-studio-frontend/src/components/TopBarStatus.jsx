import React from 'react'
import LoginSpotifyButton from './LoginSpotifyButton.jsx'

export default function TopBarStatus({ mode, setMode, token, setToken }){
  return (
    <div className="top-bar">
      <div className="brand">
        <span className="dot-live"></span>
        <h1>DJ Studio</h1>
        <span className="subtitle">Futuristic Deck</span>
      </div>
      <div className="controls">
        <div className="mode-toggle">
          <button className={mode==='local' ? 'active' : ''} onClick={()=>setMode('local')}>Local</button>
          <button className={mode==='spotify' ? 'active' : ''} onClick={()=>setMode('spotify')}>Spotify</button>
        </div>
        {mode==='spotify' && <LoginSpotifyButton token={token} setToken={setToken} />}
      </div>
    </div>
  )
}
