exports.handler = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
    'user-read-email',
    'user-read-private',
    'playlist-read-private'
  ].join(' ')
  const url = new URL('https://accounts.spotify.com/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', scopes)
  url.searchParams.set('show_dialog', 'true')
  return { statusCode: 302, headers: { Location: url.toString() } }
}
