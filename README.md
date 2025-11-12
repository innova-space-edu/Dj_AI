# DJ Studio v4

## Variables Spotify (Netlify)
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI` (ej: https://tu-sitio.netlify.app/.netlify/functions/auth-spotify-callback)

Para desarrollo con **Netlify Dev**: `http://localhost:8888/.netlify/functions/auth-spotify-callback` debe estar registrado en Spotify Dashboard como Redirect URI.

## Frontend local
```bash
cd dj-studio-frontend
npm install
npm run dev
```
