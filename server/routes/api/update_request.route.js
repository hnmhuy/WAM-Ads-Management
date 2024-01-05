'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/update_request');

router.post('/createUpdateRequestAdPlace', controller.createUpdateRequestAdPlace);

module.exports = router;