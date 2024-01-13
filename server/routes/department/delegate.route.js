const express = require("express");
const router = express.Router();
const controller = require("../../controllers/department/delegate.controller");
const auth = require("../../controllers/auth.controller")

router.get("/", auth.isLoggedIn, auth.isDepartment, controller.show);

module.exports = router;
