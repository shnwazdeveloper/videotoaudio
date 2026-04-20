const { v4: uuidv4 } = require('uuid');

const inlineHandler = async (ctx) => {
  const query = ctx.inlineQuery.query || '';

  const results = [
    {
      type: 'article',
      id: uuidv4(),
      title: 'video to audio converter',
      description: 'convert any video file to mp3 audio instantly',
      input_message_content: {
        message_text:
          'video to audio converter bot\n\n' +
          'send any video file to this bot and get mp3 audio back.\n\n' +
          'start the bot: @' + (process.env.BOT_USERNAME || 'your_bot'),
      },
      reply_markup: {
        inline_keyboard: [
          [{ text: 'open bot', url: `https://t.me/${process.env.BOT_USERNAME || 'your_bot'}` }],
        ],
      },
    },
    {
      type: 'article',
      id: uuidv4(),
      title: 'how to convert video',
      description: 'step by step guide',
      input_message_content: {
        message_text:
          'how to convert video to audio:\n\n' +
          '1. open the bot\n' +
          '2. send any video file\n' +
          '3. wait a few seconds\n' +
          '4. receive your mp3 audio\n\n' +
          'supported: mp4, mov, avi, mkv, webm',
      },
    },
  ];

  await ctx.answerInlineQuery(results, { cache_time: 30 });
};

module.exports = inlineHandler;
