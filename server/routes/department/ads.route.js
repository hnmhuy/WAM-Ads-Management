const express = require("express");
const router = express.Router();
const controller = require("../../controllers/department/ads.controller");

router.get("/", controller.showAds);
router.get("/request", controller.showRequest);

module.exports = router;
