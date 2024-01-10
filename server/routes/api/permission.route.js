const express = require('express');
const router = express.Router();
const controller = require("../../api/permission");

router.get("/get", controller.getPermission)

module.exports = router;