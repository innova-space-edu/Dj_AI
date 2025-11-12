export function createEngine(){
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioCtx()

  const master = ctx.createGain(); master.gain.value = 1
  const analyser = ctx.createAnalyser(); analyser.fftSize = 2048
  const preGain = ctx.createGain(); preGain.gain.value = 1

  const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 18000
  const delay = ctx.createDelay(5.0); delay.delayTime.value = 0.25
  const feedback = ctx.createGain(); feedback.gain.value = 0.35
  const wetGain = ctx.createGain(); wetGain.gain.value = 0.0
  const dryGain = ctx.createGain(); dryGain.gain.value = 1.0

  preGain.connect(dryGain); dryGain.connect(master)
  preGain.connect(filter); filter.connect(delay); delay.connect(feedback); feedback.connect(delay); delay.connect(wetGain); wetGain.connect(master)

  master.connect(analyser); analyser.connect(ctx.destination)

  let mediaSrc=null
  function attachMediaElement(el){
    if(mediaSrc) try{ mediaSrc.disconnect() }catch{}
    mediaSrc = ctx.createMediaElementSource(el)
    mediaSrc.connect(preGain)
  }

  function clamp(x,min,max){ return Math.min(Math.max(x,min),max) }

  return {
    ctx, master, analyser,
    attachMediaElement,
    setWetMix(v){ wetGain.gain.value = clamp(v,0,1) },
    setDelayTime(s){ delay.delayTime.value = clamp(s,0,5) },
    setFeedback(v){ feedback.gain.value = clamp(v,0,0.95) },
    setLowpassFreq(hz){ filter.frequency.value = clamp(hz,40,20000) }
  }
}
