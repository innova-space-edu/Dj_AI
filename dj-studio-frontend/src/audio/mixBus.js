/**
 * Creates and returns a master GainNode connected to the destination.
 * You can adjust the gain property to control the overall output
 * volume of your application. All audio sources should route through
 * this node for consistent control.
 */
export function createMasterGain(audioContext) {
  const gain = audioContext.createGain();
  gain.gain.value = 1.0;
  gain.connect(audioContext.destination);
  return gain;
}