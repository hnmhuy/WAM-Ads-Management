'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/report');

router.get('/getReports', controller.getReports);

module.exports = router;