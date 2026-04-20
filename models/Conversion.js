const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telegramId: { type: Number, required: true },
  originalFileName: { type: String, default: 'unknown' },
  originalSize: { type: Number, default: 0 },
  outputUrl: { type: String, default: null },
  status: { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending' },
  errorMessage: { type: String, default: null },
  duration: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Conversion', conversionSchema);
