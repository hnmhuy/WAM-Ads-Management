const express = require('express');
const router = express.Router();

router.use('/category', require('./category.route'));
router.use('/area', require('./area.route'));
router.use('/feedback', require('./feedback.route'));
router.use('/delegate', require('./delegate.route'));
router.use('/location', require('./location.route'));
router.use('/report', require('./report.route'));
router.use('/analysis', require('./analysis.route'));
router.use('/place', require('./place.route'));
router.use('/ad_place', require('./ad_place.route'));
router.use('/permission', require('./permission.route'));

module.exports = router;