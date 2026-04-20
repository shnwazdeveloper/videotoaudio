const levels = { info: 'info', warn: 'warn', error: 'error' };

const format = (level, ...args) => {
  const time = new Date().toISOString();
  return `[${time}] [${level.toUpperCase()}] ${args.join(' ')}`;
};

const logger = {
  info: (...args) => console.log(format(levels.info, ...args)),
  warn: (...args) => console.warn(format(levels.warn, ...args)),
  error: (...args) => console.error(format(levels.error, ...args)),
};

module.exports = logger;
