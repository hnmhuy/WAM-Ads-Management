const express = require('express');
const router = express.Router();
const controller = require('../../api/area')

router.get('/getArea', controller.getArea);
router.post('/createArea', controller.createArea);

module.exports = router;