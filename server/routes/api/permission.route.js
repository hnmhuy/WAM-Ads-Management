const express = require('express');
const router = express.Router();
const controller = require("../../api/permission");
const multer = require("multer");
const upload = multer({dest:`uploads/create_request`});

router.get("/get", controller.getPermission)
router.post("/add", upload.array('imgFile', 2) ,controller.createRequest)

module.exports = router;