import React, { useEffect, useRef, useState } from 'react'
import TopBar from './components/TopBarStatus.jsx'
import PlaylistPanel from './components/PlaylistPanel.jsx'
import QueuePanel from './components/QueuePanel.jsx'
import PlayerDeck from './components/PlayerDeck.jsx'
import Visualizer from './components/Visualizer.jsx'
import VoicePanel from './components/VoicePanel.jsx'
import FXPanel from './components/FXPanel.jsx'
import { createEngine } from './audio/audioEngine.js'

export default function App(){
  const [mode, setMode] = useState('local')
  const [token, setToken] = useState(null)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const audioRef = useRef(null)
  const engineRef = useRef(null)
  useEffect(()=>{
    const engine = createEngine()
    engineRef.current = engine
    const el = new Audio()
    el.preload = 'auto'; el.crossOrigin='anonymous'
    el.addEventListener('ended', ()=>next())
    engine.attachMediaElement(el)
    audioRef.current = el
  },[])
  function add(item){
    setQueue(q=>{
      const nq = [...q, item]
      if(!current) play(item)
      return nq
    })
  }
  function play(item){
    item = item || current
    if(!item) return
    setCurrent(item)
    if(item.source==='local'){
      audioRef.current.src = item.url
      audioRef.current.play()
    } else {
      // Spotify control se hace desde su SDK
    }
  }
  function pause(){ audioRef.current?.pause() }
  function next(){
    setQueue(q=>{
      if(q.length<=1){ setCurrent(null); return [] }
      const [, ...rest] = q
      setCurrent(rest[0])
      if(rest[0]?.source==='local'){
        audioRef.current.src = rest[0].url
        audioRef.current.play()
      }
      return rest
    })
  }
  const engine = engineRef.current
  return (
    <div className="app-container">
      <TopBar mode={mode} setMode={setMode} token={token} setToken={setToken} />
      <div className="grid-3">
        <aside className="left-col">
          <PlaylistPanel mode={mode} token={token} onAdd={add} />
          <QueuePanel queue={queue} onPlay={play} />
        </aside>
        <main className="center-col">
          {engine && <Visualizer analyser={engine.analyser} />}
          <PlayerDeck current={current} onPlay={()=>play()} onPause={pause} onNext={next} />
        </main>
        <aside className="right-col">
          <VoicePanel audioEl={audioRef} />
          {engine && <FXPanel engine={engine} />}
        </aside>
      </div>
    </div>
  )
}
