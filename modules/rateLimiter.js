const requests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

/**
 * check if a user is rate limited
 * @param {number} userId
 * @returns {boolean} true if allowed, false if limited
 */
const isAllowed = (userId) => {
  const now = Date.now();
  const entry = requests.get(userId) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + WINDOW_MS;
    requests.set(userId, entry);
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  requests.set(userId, entry);
  return true;
};

/**
 * get seconds remaining until user can make a new request
 * @param {number} userId
 * @returns {number}
 */
const getRetryAfter = (userId) => {
  const entry = requests.get(userId);
  if (!entry) return 0;
  return Math.ceil((entry.resetAt - Date.now()) / 1000);
};

module.exports = { isAllowed, getRetryAfter };
