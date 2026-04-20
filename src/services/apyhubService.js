const fetch = require('node-fetch');
const FormData = require('form-data');
const logger = require('../../modules/logger');

const APYHUB_TOKEN = process.env.APYHUB_API_KEY;
const APYHUB_BASE = 'https://api.apyhub.com/convert';

/**
 * convert video buffer to mp3 audio using apyhub
 * @param {Buffer} videoBuffer - raw video bytes
 * @param {string} fileName - original file name
 * @returns {Promise<string>} public download url of the converted audio
 */
const convertVideoToAudio = async (videoBuffer, fileName = 'video.mp4') => {
  try {
    const form = new FormData();
    form.append('file', videoBuffer, { filename: fileName, contentType: 'video/mp4' });
    form.append('output', 'mp3');

    const response = await fetch(`${APYHUB_BASE}/video-mp3`, {
      method: 'POST',
      headers: {
        'apy-token': APYHUB_TOKEN,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`apyhub error ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (!data.data) {
      throw new Error('apyhub returned no download url');
    }

    logger.info(`apyhub conversion success: ${data.data}`);
    return data.data;
  } catch (err) {
    logger.error('apyhub conversion failed:', err.message);
    throw err;
  }
};

module.exports = { convertVideoToAudio };
