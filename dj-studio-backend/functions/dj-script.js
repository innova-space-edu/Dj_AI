/**
 * A simple script generator for the DJ voice. It returns a generic
 * sentence based on the provided current track and mood. This is a
 * placeholder for integration with a language model or other AI
 * service capable of generating dynamic text.
 */
exports.handler = async (event) => {
  try {
    const { currentTrack, mood } = JSON.parse(event.body || '{}');
    const script = `¡Ahora escuchas ${currentTrack || 'una canción'} con una vibra ${mood || 'increíble'}!`;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Script generation error' }),
    };
  }
};