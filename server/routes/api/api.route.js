const express = require('express');
const router = express.Router();

router.use('/category', require('./category.route'));
router.use('/area', require('./area.route'));
router.use('/feedback', require('./feedback.route'));
router.use('/delegate', require('./delegate.route'));

module.exports = router;