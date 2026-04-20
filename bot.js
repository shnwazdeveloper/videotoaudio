require('dotenv').config();
const { Telegraf } = require('telegraf');
const connectDB = require('./config/database');
const conversionHandler = require('./src/handlers/conversionHandler');
const startHandler = require('./src/handlers/startHandler');
const helpHandler = require('./src/handlers/helpHandler');
const inlineHandler = require('./src/handlers/inlineHandler');
const callbackHandler = require('./src/handlers/callbackHandler');
const { isAllowed, getRetryAfter } = require('./modules/rateLimiter');
const logger = require('./modules/logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

connectDB();

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();
  if (!isAllowed(userId)) {
    const retry = getRetryAfter(userId);
    await ctx.reply(`too many requests. please wait ${retry} seconds.`);
    return;
  }
  return next();
});

bot.start(startHandler);
bot.help(helpHandler);
bot.on('callback_query', callbackHandler);
bot.on('inline_query', inlineHandler);
bot.on(['video', 'document', 'video_note'], conversionHandler);

bot.on('message', async (ctx) => {
  if (!ctx.message.video && !ctx.message.document && !ctx.message.video_note) {
    await ctx.reply('please send a video file to convert it to audio. use /help for instructions.');
  }
});

bot.launch()
  .then(() => logger.info('bot is running'))
  .catch(err => logger.error('bot launch error:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
