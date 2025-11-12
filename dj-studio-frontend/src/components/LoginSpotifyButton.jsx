import React, { useEffect } from 'react'
import { initSpotifyPlayer } from '../spotify/spotifyPlayer.js'
import { transferPlayback } from '../spotify/spotifyApi.js'

export default function LoginSpotifyButton({ token, setToken }){
  useEffect(()=>{
    function onMessage(e){
      try{
        const data = e.data || {}
        if(data.type === 'spotify-auth' && data.access_token){
          setToken(data.access_token)
          initSpotifyPlayer(data.access_token, async (deviceId)=>{
            await transferPlayback(data.access_token, deviceId)
          }).catch(err => alert('Error Spotify SDK: ' + err))
        }
      }catch(_){}
    }
    window.addEventListener('message', onMessage)
    return ()=> window.removeEventListener('message', onMessage)
  }, [setToken])

  const login = () => {
    const w = 520, h = 640
    const y = window.top.outerHeight/2 + window.top.screenY - ( h/2)
    const x = window.top.outerWidth/2  + window.top.screenX - ( w/2)
    // abre la función serverless (Netlify) que redirige a Spotify
    window.open('/.netlify/functions/auth-spotify-login', 'sp-login', `width=${w},height=${h},left=${x},top=${y}`)
  }

  return (
    <button onClick={login} className="btn-spotify">
      {token ? 'Conectado a Spotify' : 'Iniciar sesión con Spotify'}
    </button>
  )
}
