import React, { useState } from 'react'
export default function VoicePanel({ audioEl }){
  const [text, setText] = useState('Bienvenidos a DJ Studio. ¡Deja que el bajo te guíe!')
  const [voice, setVoice] = useState('female')
  const [pitch, setPitch] = useState(1)
  const [rate, setRate] = useState(1)
  const speak = () => {
    const u = new SpeechSynthesisUtterance(text)
    u.pitch = pitch; u.rate = rate
    const voices = window.speechSynthesis.getVoices()
    const pick = voices.find(v => voice==='female' ? /female|woman|es|spa/i.test(v.name) : /male|man|es|spa/i.test(v.name)) || voices[0]
    if(pick) u.voice = pick
    const prev = audioEl.current?.volume ?? 1
    if(audioEl.current){ audioEl.current.volume = 0.25 }
    u.onend = ()=>{ if(audioEl.current) audioEl.current.volume = prev }
    window.speechSynthesis.speak(u)
  }
  return (
    <div className="panel voice-panel glass">
      <h3>Voz del DJ (demo local)</h3>
      <textarea value={text} onChange={e=>setText(e.target.value)} />
      <div className="row">
        <label>Voz</label>
        <select value={voice} onChange={e=>setVoice(e.target.value)}>
          <option value="female">Femenina</option>
          <option value="male">Masculina</option>
        </select>
      </div>
      <div className="row sliders">
        <label>Pitch</label>
        <input type="range" min="0.5" max="2" step="0.01" value={pitch} onChange={e=>setPitch(+e.target.value)} />
        <label>Velocidad</label>
        <input type="range" min="0.7" max="1.5" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} />
      </div>
      <button onClick={speak}>Hablar ahora</button>
    </div>
  )
}
