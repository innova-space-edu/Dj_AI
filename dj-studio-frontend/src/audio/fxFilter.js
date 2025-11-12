/**
 * Returns a simple low-pass BiquadFilterNode. You can change the
 * type property to "highpass" or other types for different effects.
 */
export function createLowPassFilter(audioContext, frequency = 1000) {
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = frequency;
  return filter;
}