const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.get("/", controller.isLoggedIn, controller.showIndex);
// router.get("/profile", controller.isLoggedIn, controller.showProfile);
// router.get("/logout", controller.logout);

router.get("/login", controller.showLogin);
router.post("/login", controller.login);

router.get("/home", controller.isLoggedIn,controller.showHome)
router.get("/location", controller.isLoggedIn, controller.showLocation)
router.get("/permission", controller.isLoggedIn, controller.showPermission)
router.get("/report", controller.isLoggedIn, controller.showReport)

module.exports = router;