const fetch = require('node-fetch');
const logger = require('./logger');

/**
 * download a file from a url and return its buffer
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
const downloadFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`download failed: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.buffer();
  logger.info(`downloaded ${buffer.length} bytes from ${url}`);
  return buffer;
};

module.exports = { downloadFile };
