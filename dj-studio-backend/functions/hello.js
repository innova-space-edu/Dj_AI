// DJ-Studio/dj-studio-backend/functions/hello.js
export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, time: new Date().toISOString() })
  }
}
