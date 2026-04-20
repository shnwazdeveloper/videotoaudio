const helpHandler = async (ctx) => {
  const helpText =
    'video to audio converter\n\n' +
    'how to use:\n' +
    '1. send a video file to this chat\n' +
    '2. the bot converts it to mp3\n' +
    '3. the audio file is sent back to you\n\n' +
    'commands:\n' +
    '/start - restart the bot\n' +
    '/help - show this message\n\n' +
    'supported formats:\n' +
    'mp4, mov, avi, mkv, webm, 3gp\n\n' +
    'inline mode:\n' +
    'type @yourbot in any chat to share info about the bot';

  await ctx.reply(helpText, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'send a video to convert', callback_data: 'how_to' }],
      ],
    },
  });
};

module.exports = helpHandler;
