import React, { useEffect, useRef, useState } from 'react'
import TopBar from './components/TopBarStatus.jsx'
import PlaylistPanel from './components/PlaylistPanel.jsx'
import QueuePanel from './components/QueuePanel.jsx'
import PlayerDeck from './components/PlayerDeck.jsx'
import Visualizer from './components/Visualizer.jsx'
import VoicePanel from './components/VoicePanel.jsx'
import FXPanel from './components/FXPanel.jsx'
import { createEngine } from './audio/audioEngine.js'

/**
 * Utilidades Web API de Spotify (control de reproducción)
 */
async function spotifyFetch(token, endpoint, options = {}) {
  const base = 'https://api.spotify.com/v1'
  const res = await fetch(base + endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  // Silenciar 204 No Content
  if (res.status === 204) return null
  if (!res.ok) {
    let errText = ''
    try { errText = await res.text() } catch {}
    throw new Error(`Spotify API ${res.status}: ${errText || res.statusText}`)
  }
  return res.json()
}

async function transferPlayback(token, device_id, play = true) {
  await spotifyFetch(token, '/me/player', {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [device_id], play })
  })
}

async function playSpotifyURI(token, uris, position_ms = 0) {
  await spotifyFetch(token, '/me/player/play', {
    method: 'PUT',
    body: JSON.stringify({
      uris: Array.isArray(uris) ? uris : [uris],
      position_ms
    })
  })
}

async function nextSpotify(token) {
  await spotifyFetch(token, '/me/player/next', { method: 'POST' })
}

async function pauseSpotify(token) {
  await spotifyFetch(token, '/me/player/pause', { method: 'PUT' })
}

export default function App(){
  const [mode, setMode] = useState('local') // 'local' | 'spotify'
  const [token, setToken] = useState(null)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [spotifyReady, setSpotifyReady] = useState(false)
  const [spotifyDeviceId, setSpotifyDeviceId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef(null)
  const engineRef = useRef(null)
  const spotifyPlayerRef = useRef(null)

  // Inicializa motor de audio y <audio>
  useEffect(()=>{
    const engine = createEngine()
    engineRef.current = engine
    const el = new Audio()
    el.preload = 'auto'; el.crossOrigin='anonymous'
    el.addEventListener('ended', ()=>next())
    engine.attachMediaElement(el)
    audioRef.current = el
  },[])

  // Inicializa Spotify Web Playback SDK cuando haya token y modo spotify
  useEffect(()=>{
    let cleanup = () => {}
    if (mode !== 'spotify' || !token) return

    function initPlayer(){
      if (spotifyPlayerRef.current) return
      const player = new window.Spotify.Player({
        name: 'DJ Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.8
      })
      spotifyPlayerRef.current = player

      player.addListener('ready', async ({ device_id }) => {
        setSpotifyDeviceId(device_id)
        setSpotifyReady(true)
        // Transferimos la reproducción al nuevo dispositivo
        try { await transferPlayback(token, device_id, false) } catch {}
      })

      player.addListener('not_ready', ({ device_id }) => {
        if (spotifyDeviceId === device_id) setSpotifyReady(false)
      })

      player.addListener('player_state_changed', (state) => {
        if (!state) return
        setIsPlaying(!state.paused)
        // Si quieres, aquí puedes mapear state.track_window.current_track a "current"
      })

      player.addListener('initialization_error', ({ message }) => console.error('Spotify init error', message))
      player.addListener('authentication_error', ({ message }) => console.error('Spotify auth error', message))
      player.addListener('account_error', ({ message }) => console.error('Spotify account error', message))
      player.addListener('playback_error', ({ message }) => console.error('Spotify playback error', message))

      player.connect()

      cleanup = () => {
        player.disconnect()
        spotifyPlayerRef.current = null
      }
    }

    if (window.Spotify) {
      initPlayer()
    } else {
      // El SDK lo carga main.jsx; esperamos a que esté listo
      const prev = window.onSpotifyWebPlaybackSDKReady
      window.onSpotifyWebPlaybackSDKReady = () => {
        if (typeof prev === 'function') prev()
        initPlayer()
      }
    }

    return () => cleanup()
  }, [mode, token])

  function add(item){
    setQueue(q=>{
      const nq = [...q, item]
      if(!current) play(item)
      return nq
    })
  }

  async function play(item){
    item = item || current
    if(!item) return
    setCurrent(item)

    if(item.source==='local' || mode === 'local'){
      audioRef.current.src = item.url
      await audioRef.current.play().catch(console.warn)
    } else if ((item.source==='spotify' || mode === 'spotify') && token){
      try{
        // Si recibes un track/playlist, soporta uri de track o arreglo de uris
        const uri = item.uri || item.spotifyUri || item.url // fallback si guardaste la uri en url
        // Garantiza que el dispositivo activo sea el del Web Playback
        if (spotifyDeviceId) {
          await transferPlayback(token, spotifyDeviceId, false)
        }
        await playSpotifyURI(token, uri, 0)
        setIsPlaying(true)
      }catch(e){
        console.error(e)
      }
    } else {
      // Spotify control se hace desde su SDK — si no hay token, no hacemos nada
      console.warn('No Spotify token or invalid item.source')
    }
  }

  function pause(){
    if (mode==='spotify' && token){
      pauseSpotify(token).catch(console.warn)
      setIsPlaying(false)
      return
    }
    audioRef.current?.pause()
  }

  async function next(){
    if (mode==='spotify' && token){
      try{
        await nextSpotify(token)
      }catch(e){ console.error(e) }
      return
    }
    // Local
    setQueue(q=>{
      if(q.length<=1){ setCurrent(null); return [] }
      const [, ...rest] = q
      setCurrent(rest[0])
      if(rest[0]?.source==='local'){
        audioRef.current.src = rest[0].url
        audioRef.current.play().catch(console.warn)
      }
      return rest
    })
  }

  const engine = engineRef.current

  return (
    <div className="app-container">
      <TopBar
        mode={mode}
        setMode={(m)=>{ setMode(m); /* opcional: reiniciar flags */ }}
        token={token}
        setToken={setToken}
        spotifyStatus={{
          ready: spotifyReady,
          deviceId: spotifyDeviceId,
          playing: isPlaying
        }}
      />
      <div className="grid-3">
        <aside className="left-col">
          <PlaylistPanel mode={mode} token={token} onAdd={add} />
          <QueuePanel queue={queue} onPlay={play} />
        </aside>
        <main className="center-col">
          {engine && <Visualizer analyser={engine.analyser} />}
          <PlayerDeck
            current={current}
            onPlay={()=>play()}
            onPause={pause}
            onNext={next}
            isPlaying={isPlaying}
            mode={mode}
          />
        </main>
        <aside className="right-col">
          <VoicePanel audioEl={audioRef} />
          {engine && <FXPanel engine={engine} />}
        </aside>
      </div>
    </div>
  )
}
