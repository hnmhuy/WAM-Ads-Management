'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/update_request');

router.post('/createUpdateRequestAdPlace', controller.createUpdateRequestAdPlace);
router.get('/getUpdateRequest', controller.getUpdateRequest)
module.exports = router;