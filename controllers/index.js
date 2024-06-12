const indexModel = require('../models/index')
const { body, validationResult } = require('express-validator');

const identify = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: true,
        response_code: 400,
        response_desc: errors?.array()?.map(o => o.msg)?.toString()
      });
    }

    const body = req?.body || {}
    const data = await indexModel.identify(body)
    return res.status(200).json({
      error: false,
      response_code: 200,
      response_desc: 'Success',
      data: data
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: true,
      response_code: error.statusCode || 500,
      response_desc: error.message || "Something went wrong.",
    });
  }
};

module.exports = { identify }