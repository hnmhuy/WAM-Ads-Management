const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/review_edit_request.controller")
const auth = require("../../controllers/auth.controller");

router.get("/", auth.isLoggedIn, auth.isOfficer, controller.show)

module.exports = router