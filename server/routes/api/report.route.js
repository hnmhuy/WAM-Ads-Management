'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/report');

router.get('/getReports', controller.getReports);
router.post('/createResponse', controller.createResponse)
router.post('/updateFeedback', controller.updateFeedback)
module.exports = router;