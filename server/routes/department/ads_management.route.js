const express = require("express");
const router = express.Router();
const controller = require("../../controllers/department/ads_management.controller");

router.get("/", controller.show);

module.exports = router;
