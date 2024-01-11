'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../api/update_request');

router.post('/createUpdateRequestAdPlace', controller.createUpdateRequestAdPlace);
router.get('/getUpdateAmount', controller.getUpdateAmount);
router.get('/getUpdateReqList', controller.getUpdateReqList);
router.get('/getUpdateRequest', controller.getUpdateRequest)
router.post('/rejectUpdateRequest', controller.rejectUpdate);
router.post('/acceptUpdateRequest', controller.acceptUpdate);
module.exports = router;