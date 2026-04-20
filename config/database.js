const mongoose = require('mongoose');
const logger = require('../modules/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('mongodb connected');
  } catch (err) {
    logger.error('mongodb connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
