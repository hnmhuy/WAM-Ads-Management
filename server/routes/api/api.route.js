const express = require('express');
const router = express.Router();

router.use('/category', require('./category.route'));

module.exports = router;