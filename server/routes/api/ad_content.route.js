const express = require('express');
const router = express.Router();
const controller = require('../../api/ad_content');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.get('/get', controller.get); 
router.post('/update', upload.none(), controller.update);


module.exports = router;