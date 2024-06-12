const express = require('express');
const logger = require('morgan');
const database = require('./database/mongoDB')
database.connect()

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const indexRouter = require('./routes/index');

app.use('/api/v1', indexRouter);

// error handler
app.use(function (req, res) {
  return res.status(404).send({
    error: true,
    response_code: 404,
    response_desc: 'Not found'
  })
});

module.exports = app;
