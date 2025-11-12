/***** Spotify Web Playback SDK Loader + Initializer *****/
let sdkLoadingPromise = null
export function loadSpotifySDK(){
  if (window.Spotify) return Promise.resolve()
  if (!sdkLoadingPromise){
    sdkLoadingPromise = new Promise((resolve)=>{
      const s = document.createElement('script')
      s.src = 'https://sdk.scdn.co/spotify-player.js'
      s.onload = () => resolve()
      document.body.appendChild(s)
    })
  }
  return sdkLoadingPromise
}

let player = null
export async function initSpotifyPlayer(token, onReady){
  await loadSpotifySDK()
  return new Promise((resolve, reject)=>{
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'DJ Studio Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.8
      })
      player.addListener('ready', ({ device_id }) => {
        onReady && onReady(device_id)
        resolve({ device_id })
      })
      player.addListener('initialization_error', ({ message }) => reject(message))
      player.addListener('authentication_error', ({ message }) => reject(message))
      player.addListener('account_error', ({ message }) => reject(message))
      player.connect()
    }
  })
}

export function getPlayer(){ return player }
