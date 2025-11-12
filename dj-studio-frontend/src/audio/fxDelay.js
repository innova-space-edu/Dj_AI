/**
 * Creates a DelayNode with feedback for echo effects. The returned
 * node needs to be connected into your audio graph. You can adjust
 * the delay time and feedback gain to taste.
 */
export function createDelayNode(audioContext, time = 0.3, feedback = 0.5) {
  const delay = audioContext.createDelay();
  const feedbackGain = audioContext.createGain();
  delay.delayTime.value = time;
  feedbackGain.gain.value = feedback;
  delay.connect(feedbackGain);
  feedbackGain.connect(delay);
  return delay;
}