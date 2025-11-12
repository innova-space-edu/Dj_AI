import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/theme.css'
import './styles/layout.css'
import './styles/components.css'

// Carga perezosa del SDK de Spotify si no existe (mejora conexión Spotify)
(function ensureSpotifySDK(){
  if (window.Spotify) return
  const id = 'spotify-web-playback-sdk'
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = 'https://sdk.scdn.co/spotify-player.js'
  document.head.appendChild(s)
})()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
