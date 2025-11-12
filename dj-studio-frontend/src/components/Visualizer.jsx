import React, { useEffect, useRef } from 'react'
export default function Visualizer({ analyser }){
  const canvasRef = useRef(null)
  useEffect(()=>{
    if(!analyser) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const buffer = new Uint8Array(analyser.frequencyBinCount)
    let raf
    function draw(){
      const w = canvas.width = canvas.clientWidth
      const h = canvas.height = canvas.clientHeight
      ctx.clearRect(0,0,w,h)
      analyser.getByteFrequencyData(buffer)
      const bars = 96; const step = Math.floor(buffer.length / bars)
      for(let i=0;i<bars;i++){
        const v = buffer[i*step] / 255
        const barH = v * (h*0.9)
        const x = (w/bars)*i + 2
        ctx.fillStyle = `hsl(${200 + i*1.3}, 90%, ${40 + v*40}%)`
        ctx.fillRect(x, h-barH, (w/bars)-4, barH)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return ()=> cancelAnimationFrame(raf)
  }, [analyser])
  return <div className="panel visualizer glass"><canvas className="visualizer-canvas" ref={canvasRef} /></div>
}
