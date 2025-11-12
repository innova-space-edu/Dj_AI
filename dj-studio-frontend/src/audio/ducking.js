/**
 * Functions to duck and unduck a GainNode. Ducking lowers the volume
 * temporarily to allow another sound (like speech) to be clearly heard.
 */
export function duck(gainNode) {
  if (!gainNode) return;
  gainNode.gain.setValueAtTime(0.2, gainNode.context.currentTime);
}

export function unduck(gainNode) {
  if (!gainNode) return;
  gainNode.gain.setValueAtTime(1.0, gainNode.context.currentTime);
}