import React, { useEffect, useRef, useState } from 'react'
import { fetchUserPlaylists, fetchPlaylistTracks, startTrack } from '../spotify/spotifyApi.js'

export default function PlaylistPanel({ mode, token, onAdd }){
  const fileRef = useRef(null)
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    (async ()=>{
      if(mode==='spotify' && token){
        try{
          const pls = await fetchUserPlaylists(token)
          setPlaylists(pls)
        }catch(e){ console.error(e) }
      }
    })()
  }, [mode, token])

  async function selectPlaylist(pl){
    setSelected(pl.id)
    try{
      const t = await fetchPlaylistTracks(token, pl.id)
      setTracks(t)
    }catch(e){ console.error(e) }
  }

  const onFiles = (e)=>{
    const files = Array.from(e.target.files || [])
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      onAdd({ title: f.name, url, source: 'local' })
    })
    e.target.value = ''
  }

  const loadDemo = () => {
    onAdd({ title: 'Urban Beat (demo)', url: 'https://cdn.pixabay.com/download/audio/2023/01/15/audio_3d8f6f.mp3?filename=urban-beat-135419.mp3', source: 'local' })
  }

  return (
    <div className="panel playlist-panel glass">
      <h3>Fuentes</h3>
      <div className="section">
        <h4>Local</h4>
        <input type="file" ref={fileRef} onChange={onFiles} accept="audio/*" multiple />
        <button onClick={loadDemo}>Cargar demos</button>
      </div>

      <div className="section">
        <h4>Spotify</h4>
        {mode!=='spotify' && <p className="hint">Activa “Spotify” en la barra superior.</p>}
        {mode==='spotify' && !token && <p>Conéctate para listar tus playlists.</p>}
        {mode==='spotify' && token && (
          <div className="spotify-block">
            <div className="spotify-lists">
              <ul className="list">
                {playlists.map(pl => (
                  <li key={pl.id} className="list-item">
                    <span onClick={()=>selectPlaylist(pl)} style={{cursor:'pointer'}}>{pl.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            {selected && (
              <div className="spotify-tracks">
                <h4>Tracks</h4>
                <ul className="list">
                {tracks.map(tr => (
                  <li key={tr.id} className="list-item">
                    <span>{tr.name} — {tr.artists?.[0]?.name}</span>
                    <div>
                      <button onClick={()=>startTrack(token, tr.uri)}>▶︎</button>
                      <button onClick={()=>onAdd({ title: tr.name, url: tr.preview_url, source:'local' })} disabled={!tr.preview_url}>Add (preview)</button>
                    </div>
                  </li>
                ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
