const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/permission.controller")
const auth = require("../../controllers/auth.controller");
const multer = require("multer");
const upload = multer({dest:`uploads/create_request`});

// router.get("/", controller.show)
router.post("/",upload.array('imgFile', 2), controller.createRequest);
router.get("/", auth.isLoggedIn, auth.isOfficer, controller.show)

module.exports = router