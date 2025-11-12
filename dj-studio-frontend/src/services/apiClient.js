/**
 * Centralized API client for communicating with backend functions. The
 * functions here wrap fetch calls to Netlify serverless functions,
 * making it easier to change endpoints in one place.
 */

export async function callTTS(text, voice = 'female') {
  const res = await fetch('/.netlify/functions/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) {
    throw new Error('TTS request failed');
  }
  return await res.json();
}