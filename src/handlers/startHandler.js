const User = require('../../models/User');
const logger = require('../../modules/logger');

const START_IMAGE_URL = process.env.START_IMAGE_URL || 'https://telegra.ph/file/placeholder.jpg';

const startHandler = async (ctx) => {
  try {
    const from = ctx.from;

    let user = await User.findOne({ telegramId: from.id });
    if (!user) {
      user = await User.create({
        telegramId: from.id,
        username: from.username || null,
        firstName: from.first_name || null,
        lastName: from.last_name || null,
      });
      logger.info(`new user registered: ${from.id}`);
    } else {
      user.lastActiveAt = new Date();
      await user.save();
    }

    const name = from.first_name || from.username || 'there';

    await ctx.replyWithPhoto(
      { url: START_IMAGE_URL },
      {
        caption:
          `hello ${name}\n\n` +
          `this bot converts video files to mp3 audio.\n\n` +
          `just send any video and get the audio back.\n\n` +
          `use /help to see all commands.\n\n` +
          `supported formats: mp4, mov, avi, mkv, webm`,
        has_spoiler: true,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'convert video', callback_data: 'how_to' }],
            [{ text: 'help', callback_data: 'help' }],
          ],
        },
      }
    );
  } catch (err) {
    logger.error('start handler error:', err.message);
    await ctx.reply('something went wrong. please try /start again.');
  }
};

module.exports = startHandler;
