const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/location.controller")

router.get("/", controller.show)

module.exports = router