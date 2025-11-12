import React, { useState } from 'react'

export default function FXPanel({ engine }){
  const [wet, setWet] = useState(0.0)
  const [delayTime, setDelayTime] = useState(0.25)
  const [feedback, setFeedback] = useState(0.35)
  const [lowpass, setLowpass] = useState(18000)

  const apply = {
    wet: v => { setWet(v); engine.setWetMix(v) },
    delay: v => { setDelayTime(v); engine.setDelayTime(v) },
    feedback: v => { setFeedback(v); engine.setFeedback(v) },
    lowpass: v => { setLowpass(v); engine.setLowpassFreq(v) },
    kill: () => { engine.setWetMix(0); setWet(0) }
  }

  return (
    <div className="panel fx-panel glass">
      <h3>FX (Delay + Low-pass)</h3>
      <div className="row sliders">
        <label>Wet Mix</label>
        <input type="range" min="0" max="1" step="0.01" value={wet} onChange={e=>apply.wet(+e.target.value)} />
        <button onClick={apply.kill}>Kill</button>
      </div>
      <div className="row sliders">
        <label>Delay</label>
        <input type="range" min="0" max="5" step="0.01" value={delayTime} onChange={e=>apply.delay(+e.target.value)} />
        <label>Feedback</label>
        <input type="range" min="0" max="0.95" step="0.01" value={feedback} onChange={e=>apply.feedback(+e.target.value)} />
      </div>
      <div className="row sliders">
        <label>Low-pass</label>
        <input type="range" min="40" max="20000" step="1" value={lowpass} onChange={e=>apply.lowpass(+e.target.value)} />
      </div>
    </div>
  )
}
