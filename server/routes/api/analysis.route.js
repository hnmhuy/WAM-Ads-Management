const express = require('express');
const router = express.Router();
const controller = require("../../api/analysis");


router.get("/getQuantity", controller.getQuantity);


module.exports = router;
