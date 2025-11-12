// src/speak.js
let selectedVoice = null;

// Ampliamos lista de preferencia con voces femeninas comunes en Windows/Chrome/Edge
const preferredVoices = [
  // Microsoft (Edge / Windows)
  'Microsoft Sabina Online (Natural) - Spanish (Mexico)',
  'Microsoft Dalia Online (Natural) - Spanish (Mexico)',
  'Microsoft Helena - Spanish (Spain)',
  'Microsoft Laura - Spanish (Spain)',
  // Google (Chrome)
  'Google español de Estados Unidos',
  'Google español',
  'Google español de España',
  'Google español (Latinoamérica)',
];

// Determina si un nombre “suena” femenino
function isLikelyFemaleName(name = '') {
  return /sabina|helena|elena|sofia|sofia|dalia|laura|luisa|female|mujer|fem/i.test(name)
}

function pickFemaleEsVoice(voices) {
  // 1) Coincidencia por lista preferida, permitiendo includes para robustez
  for (const name of preferredVoices) {
    const v = voices.find(x => x.name && x.name.toLowerCase().includes(name.toLowerCase()))
    if (v) return v
  }
  // 2) Voces en español
  const esVoices = voices.filter(v => /^es(-|_|$)/i.test(v.lang || '') || /(Spanish)/i.test(v.lang || ''))
  // 3) Voces femeninas por nombre
  const femaleGuess = esVoices.find(v => isLikelyFemaleName(v.name))
  // 4) Fallbacks
  return femaleGuess || esVoices[0] || voices[0] || null
}

// Espera a que las voces estén disponibles (algunos navegadores tardan)
function waitForVoices(timeoutMs = 2000) {
  return new Promise(resolve => {
    const start = performance.now()
    function check() {
      const list = window.speechSynthesis.getVoices()
      if (list && list.length) return resolve(list)
      if (performance.now() - start > timeoutMs) return resolve(list || [])
      setTimeout(check, 100)
    }
    check()
  })
}

export async function initVoices() {
  const load = async () => {
    const voices = window.speechSynthesis.getVoices()
    if (voices && voices.length) {
      selectedVoice = pickFemaleEsVoice(voices)
    } else {
      const waited = await waitForVoices()
      selectedVoice = pickFemaleEsVoice(waited)
    }
  }
  await load()
  window.speechSynthesis.onvoiceschanged = async () => {
    const voices = window.speechSynthesis.getVoices()
    selectedVoice = pickFemaleEsVoice(voices)
  }
}

export function speak(text, { rate = 1, pitch = 1 } = {}) {
  if (!text) return
  const u = new SpeechSynthesisUtterance(text)
  if (selectedVoice) u.voice = selectedVoice
  u.lang = (selectedVoice && selectedVoice.lang) || 'es-ES'
  // Ajustes por defecto un poco más “femeninos” y claros
  u.rate = rate
  u.pitch = pitch < 1 ? 1 : pitch // evita voz muy grave
  try { speechSynthesis.cancel() } catch {}
  speechSynthesis.speak(u)
}
