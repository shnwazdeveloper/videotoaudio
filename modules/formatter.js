/**
 * format bytes to human readable string
 * @param {number} bytes
 * @returns {string}
 */
const formatBytes = (bytes) => {
  if (!bytes) return '0 b';
  const units = ['b', 'kb', 'mb', 'gb'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

/**
 * sanitize a file name to be safe for use
 * @param {string} name
 * @returns {string}
 */
const sanitizeFileName = (name) => {
  return name.replace(/[^a-z0-9._-]/gi, '_').toLowerCase();
};

module.exports = { formatBytes, sanitizeFileName };
