const express = require("express");
const router = express.Router();
const labelController = require("../../controllers/department/label.controller");

router.get("/", labelController.show);

module.exports = router;
