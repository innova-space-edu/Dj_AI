const pending = [];
let raf = null;
function flush(){
  const chunk = pending.splice(0);
  renderTracks(chunk);
  raf = null;
}
export function addTrackFast(track){
  pending.push(track);
  if (!raf) raf = requestAnimationFrame(flush);
}
