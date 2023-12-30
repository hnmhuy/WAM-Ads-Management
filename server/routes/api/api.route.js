const express = require('express');
const router = express.Router();

router.use('/category', require('./category.route'));
router.use('/area', require('./area.route'));
router.use('/feedback', require('./feedback.route'));
router.use('/delegate', require('./delegate.route'));
router.use('/location', require('./location.route'));
router.use('/report', require('./report.route'));
router.use('/analysis', require('./analysis.route'));

module.exports = router;