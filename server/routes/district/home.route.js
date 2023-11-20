const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/home.controller")

router.get("/", controller.show)

module.exports = router
