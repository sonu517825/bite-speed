const mongoose = require('mongoose');

module.exports.connect = () => {

  mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/bite-speed')
    .catch((err) => {
      console.log('Mongoose connection error', err.message);
      process.exit(0);
    });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error', err.message);
    process.exit(0);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to app termination...');
      process.exit(0);
    });
  });

};
