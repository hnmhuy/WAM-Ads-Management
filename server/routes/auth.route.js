const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const passport = require("passport");
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.get("/", controller.isLoggedIn, controller.showIndex);
router.get("/profile", controller.isLoggedIn, controller.showProfile);
router.put("/profile", upload.none(), controller.changeProfile);
router.post("/profile", upload.none(), controller.changePassword);
router.get("/logout", controller.logout);

router.get("/login", controller.showLogin);
router.post("/login", upload.none(), controller.login);
router.post("/register", upload.none(), controller.register);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), controller.googleCallback);

router.get("/bindAccount", controller.isLoggedIn, controller.bindAccount);
router.post("/unbindAccount", controller.isLoggedIn, controller.unbindAccount);

router.post('/forgotPassword',  controller.forgotPassword);
router.post('/otpVerification', controller.verify);
router.get('/resetPassword', controller.showResetPassword);
router.post('/resetPassword', controller.resetPassword);

module.exports = router;