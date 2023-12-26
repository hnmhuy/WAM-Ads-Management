'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/location');

// router.get("/createTypeAndPurpose", controller.createTypeAndPurpose)
router.get('/getLocations', controller.getLocations);

module.exports = router