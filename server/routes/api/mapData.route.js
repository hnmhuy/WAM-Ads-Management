const express = require('express');
const router = express.Router();
const controller = require('../../api/mapData');

router.get('/get', controller.get);

module.exports = router;