const express = require("express");
const router = express.Router();
const controller = require("../../controllers/department/ads.controller");
const auth = require("../../controllers/auth.controller");

router.get("/", controller.showAds);
router.get("/request", controller.showRequest);
router.get("/update", controller.showUpdate);
router.get("/getTableData", controller.getTableData);
// router.get("/", auth.isLoggedIn, auth.isDepartment, controller.showAds);
// router.get("/request", auth.isLoggedIn, auth.isDepartment, controller.showRequest);

module.exports = router;
