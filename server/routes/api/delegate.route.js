const express = require('express');
const controller = require("../../api/delegate")
const router = express.Router();

router.get("/getOfficer", controller.getOfficer)

module.exports = router;