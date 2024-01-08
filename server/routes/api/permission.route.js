const express = require('express');
const router = express.Router();
const controller = require("../../api/permission");


router.get("/getRequest", controller.getRequest);


module.exports = router;