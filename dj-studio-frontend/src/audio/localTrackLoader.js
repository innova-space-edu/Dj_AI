/**
 * Utility for loading a local file into an HTMLAudioElement. The caller
 * is responsible for managing the audio element's lifecycle. Returns
 * a promise that resolves to the created Audio object.
 *
 * @param {File} file The local audio file selected by the user
 */
export async function loadLocalTrack(file) {
  const url = URL.createObjectURL(file);
  const audio = new Audio(url);
  await audio.load();
  return audio;
}