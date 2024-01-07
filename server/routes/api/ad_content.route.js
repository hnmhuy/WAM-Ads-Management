const express = require('express');
const router = express.Router();
const controller = require('../../api/ad_content');

router.get('/get', controller.get); 


module.exports = router;