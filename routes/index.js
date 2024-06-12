const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");
const reqValidator = require('../validator/index')

router.post("/identify", reqValidator['/identify'], indexController.identify);

module.exports = router;
