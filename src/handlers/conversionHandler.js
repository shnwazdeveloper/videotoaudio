const fetch = require('node-fetch');
const User = require('../../models/User');
const Conversion = require('../../models/Conversion');
const { convertVideoToAudio } = require('../services/apyhubService');
const logger = require('../../modules/logger');

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50mb telegram bot api limit

const conversionHandler = async (ctx) => {
  const from = ctx.from;
  let processingMsg = null;
  let conversionDoc = null;

  try {
    const fileInfo = extractFileInfo(ctx);
    if (!fileInfo) {
      await ctx.reply('please send a valid video file.');
      return;
    }

    const { fileId, fileName, fileSize } = fileInfo;

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      await ctx.reply('file is too large. maximum size is 50mb.');
      return;
    }

    processingMsg = await ctx.reply('processing your video...');

    let user = await User.findOne({ telegramId: from.id });
    if (!user) {
      user = await User.create({
        telegramId: from.id,
        username: from.username || null,
        firstName: from.first_name || null,
      });
    }

    conversionDoc = await Conversion.create({
      userId: user._id,
      telegramId: from.id,
      originalFileName: fileName,
      originalSize: fileSize || 0,
      status: 'processing',
    });

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const videoResponse = await fetch(fileLink.href);

    if (!videoResponse.ok) {
      throw new Error(`failed to download video: ${videoResponse.status}`);
    }

    const videoBuffer = await videoResponse.buffer();

    const audioUrl = await convertVideoToAudio(videoBuffer, fileName);

    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`failed to fetch converted audio`);
    }
    const audioBuffer = await audioResponse.buffer();

    const baseName = fileName.replace(/\.[^.]+$/, '');
    const audioFileName = `${baseName}.mp3`;

    await ctx.replyWithAudio(
      { source: audioBuffer, filename: audioFileName },
      { caption: `converted from: ${fileName}` }
    );

    if (processingMsg) {
      await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id).catch(() => {});
    }

    conversionDoc.status = 'done';
    conversionDoc.outputUrl = audioUrl;
    conversionDoc.completedAt = new Date();
    await conversionDoc.save();

    await user.incrementConversions();

    logger.info(`conversion done for user ${from.id}: ${fileName}`);
  } catch (err) {
    logger.error(`conversion error for user ${from.id}:`, err.message);

    if (processingMsg) {
      await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id).catch(() => {});
    }

    if (conversionDoc) {
      conversionDoc.status = 'failed';
      conversionDoc.errorMessage = err.message;
      await conversionDoc.save().catch(() => {});
    }

    await ctx.reply('conversion failed. please try again with a different video file.');
  }
};

const extractFileInfo = (ctx) => {
  if (ctx.message.video) {
    const v = ctx.message.video;
    return {
      fileId: v.file_id,
      fileName: v.file_name || `video_${Date.now()}.mp4`,
      fileSize: v.file_size,
    };
  }
  if (ctx.message.video_note) {
    const v = ctx.message.video_note;
    return {
      fileId: v.file_id,
      fileName: `video_note_${Date.now()}.mp4`,
      fileSize: v.file_size,
    };
  }
  if (ctx.message.document) {
    const d = ctx.message.document;
    const videoMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
    if (videoMimes.includes(d.mime_type)) {
      return {
        fileId: d.file_id,
        fileName: d.file_name || `video_${Date.now()}.mp4`,
        fileSize: d.file_size,
      };
    }
  }
  return null;
};

module.exports = conversionHandler;
