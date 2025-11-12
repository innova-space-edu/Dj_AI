import React from 'react'
export default function QueuePanel({ queue, onPlay }){
  return (
    <div className="panel queue-panel glass">
      <h3>Cola</h3>
      {queue.length===0 && <p className="hint">Agrega canciones desde “Fuentes”.</p>}
      <ul className="list">
        {queue.map((t,i)=>(
          <li key={i} className="list-item">
            <span>{t.title}</span>
            <button onClick={()=>onPlay(t)}>▶︎</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
