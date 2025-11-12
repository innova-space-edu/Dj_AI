// src/spotify/index.js

// TODO: Reemplaza esto por tu flujo OAuth (PKCE) y guarda/renueva el access token.
// Este placeholder es solo para probar rápido.
const TOKEN = import.meta.env.VITE_SPOTIFY_TOKEN || "<PON_AQUI_TU_ACCESS_TOKEN_VALIDO>";

/**
 * El SDK de Spotify llamará a esta función global cuando termine de cargar.
 * Debe existir en window antes (este módulo se importa desde main.jsx).
 */
window.onSpotifyWebPlaybackSDKReady = () => {
  // Crea el player
  const player = new Spotify.Player({
    name: 'DJ Studio Web Player',
    getOAuthToken: cb => cb(TOKEN),
    volume: 0.8
  });

  // Logs útiles
  player.addListener('initialization_error', ({ message }) => console.error('[Spotify] initialization_error:', message));
  player.addListener('authentication_error', ({ message }) => console.error('[Spotify] authentication_error:', message));
  player.addListener('account_error', ({ message }) => console.error('[Spotify] account_error:', message));
  player.addListener('playback_error', ({ message }) => console.error('[Spotify] playback_error:', message));

  // Estado cambia (puedes sincronizar UI si quieres)
  player.addListener('player_state_changed', state => {
    // console.log('[Spotify] state:', state);
  });

  // Dispositivo listo → transferimos reproducción y damos play
  player.addListener('ready', async ({ device_id }) => {
    console.log('[Spotify] Ready with Device ID:', device_id);

    try {
      // 1) Transferir reproducción a este device (lo marca como activo)
      await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          device_ids: [device_id],
          play: true
        })
      });

      // 2) Reproducir algo concreto (elige una de las opciones)
      //   a) Un track puntual:
      // const body = { uris: ["spotify:track:4uLU6hMCjMI75M1A2tKUQC"] };

      //   b) Una playlist con offset (ej. Today's Top Hits)
      const body = {
        context_uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
        offset: { position: 0 }
      };

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log('[Spotify] Playback started on device', device_id);
    } catch (err) {
      console.error('[Spotify] transfer/play error:', err);
    }
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.warn('[Spotify] Device ID has gone offline:', device_id);
  });

  // Conectar (abre wss://*.scdn.co)
  player.connect();
};
