const express = require('express');
const router = express.Router();

router.use('/category', require('./category.route'));
router.use('/area', require('./area.route'));
router.use('/feedback', require('./feedback.route'));

module.exports = router;