exports.handler = async (event) => {
  const code = new URL(event.rawUrl).searchParams.get('code')
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', redirectUri)

  const basic = Buffer.from(clientId + ':' + clientSecret).toString('base64')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + basic, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  const json = await res.json()
  const page = `<!doctype html><html><body>
  <script>
    window.opener && window.opener.postMessage({ type:'spotify-auth', access_token:'${json.access_token}', refresh_token:'${json.refresh_token}', expires_in:${json.expires_in} }, '*');
    window.close();
  </script>
  Autenticado. Puedes cerrar esta ventana.
  </body></html>`
  return { statusCode: 200, headers: { 'Content-Type':'text/html' }, body: page }
}
