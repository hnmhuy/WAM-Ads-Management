const express = require('express');
const controller = require("../../api/delegate")
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.get("/getOfficer", controller.getOfficer);
router.post("/updateOfficer", upload.none(), controller.updateOfficer);

module.exports = router;