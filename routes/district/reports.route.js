const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/reports.controller")

router.get("/", controller.show)

module.exports = router