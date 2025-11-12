/**
 * Batching de renderizado para listas grandes de Spotify
 * - No dependemos de una función global. Recibimos el callback por init().
 */
let pending = []
let raf = null
let renderCb = null

function flush(){
  const chunk = pending.splice(0)
  if (typeof renderCb === 'function') {
    try { renderCb(chunk) } catch (e) { console.error('renderCb error', e) }
  }
  raf = null
}

/**
 * Inicializa el módulo con un callback de renderizado.
 * @param {(tracks: any[]) => void} onRenderTracks
 */
export function initSpotifyRender(onRenderTracks){
  renderCb = onRenderTracks
}

/**
 * Encola rápidamente un track para ser renderizado en el próximo frame.
 * @param {any} track
 */
export function addTrackFast(track){
  pending.push(track)
  if (!raf) raf = requestAnimationFrame(flush)
}
