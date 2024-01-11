const express = require("express");
const router = express.Router();
const labelController = require("../../controllers/department/label.controller");
const auth = require("../../controllers/auth.controller");

router.get("/", auth.isLoggedIn, auth.isDepartment, labelController.show);
// router.get("/", auth.isLoggedIn, auth.isDepartment, labelController.show);

module.exports = router;
