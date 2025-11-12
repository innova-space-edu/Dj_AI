// src/speak.js
let selectedVoice = null;

const preferredVoices = [
  'Microsoft Sabina Online (Natural) - Spanish (Mexico)',
  'Microsoft Helena - Spanish (Spain)',
  'Google español de Estados Unidos',
  'Google español',
];

function pickFemaleEsVoice(voices) {
  for (const name of preferredVoices) {
    const v = voices.find(x => x.name.includes(name));
    if (v) return v;
  }
  const esVoices = voices.filter(v => /^es(-|_|$)/i.test(v.lang));
  const femaleGuess = esVoices.find(v => /sabina|helena|elena|sofia|female/i.test(v.name));
  return femaleGuess || esVoices[0] || voices[0] || null;
}

export function initVoices() {
  const load = () => {
    const voices = window.speechSynthesis.getVoices();
    selectedVoice = pickFemaleEsVoice(voices);
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

export function speak(text, { rate = 1, pitch = 1 } = {}) {
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  if (selectedVoice) u.voice = selectedVoice;
  u.lang = (selectedVoice && selectedVoice.lang) || 'es-ES';
  u.rate = rate;
  u.pitch = pitch;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
