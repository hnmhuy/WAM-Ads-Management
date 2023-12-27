'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/location');

router.get("/createTypeAndPurpose", controller.createTypeAndPurpose)
router.get("/createTypeAd", controller.createTypeAdContent)
router.get('/createFeedbackCategory', controller.createFeedbackCategory)
router.get('/getLocations', controller.getLocations);
router.get('/getLocationById', controller.getLocationById)
module.exports = router