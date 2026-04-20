const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  totalConversions: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

userSchema.methods.incrementConversions = function () {
  this.totalConversions += 1;
  this.lastActiveAt = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
