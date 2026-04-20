const helpHandler = require('./helpHandler');

const callbackHandler = async (ctx) => {
  const data = ctx.callbackQuery.data;

  await ctx.answerCbQuery();

  if (data === 'help' || data === 'how_to') {
    await helpHandler(ctx);
  }
};

module.exports = callbackHandler;
