export async function fetchUserPlaylists(token){
  const res = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: { Authorization: 'Bearer ' + token }
  })
  if(!res.ok) throw new Error('Spotify API error')
  const data = await res.json()
  return data.items || []
}

export async function fetchPlaylistTracks(token, playlistId){
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  if(!res.ok) throw new Error('Spotify API error')
  const data = await res.json()
  return (data.items || []).map(i => i.track).filter(Boolean)
}

export async function transferPlayback(token, deviceId){
  await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: { 'Content-Type':'application/json', Authorization:'Bearer '+token },
    body: JSON.stringify({ device_ids: [deviceId], play: true })
  })
}

export async function startTrack(token, uri){
  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: { 'Content-Type':'application/json', Authorization:'Bearer '+token },
    body: JSON.stringify({ uris: [uri] })
  })
}
