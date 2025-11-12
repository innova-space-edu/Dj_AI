// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Estilos globales
import './styles/theme.css'
import './styles/layout.css'
import './styles/components.css'

// ⚡ Importa el inicializador del Web Playback SDK (registra window.onSpotifyWebPlaybackSDKReady)
// Debe cargarse antes de que el script externo del SDK termine de cargar.
import './spotify/index.js'

// Carga perezosa del SDK de Spotify si no existe (idempotente)
;(function ensureSpotifySDK () {
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
