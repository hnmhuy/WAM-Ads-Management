const express = require('express');
const router = express.Router();
const controller = require('../../api/ad_content');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/get', controller.get);
router.post('/update', upload.none(), controller.update);
router.get('/getOne', controller.getOneAdContent);
router.post('/createAdContent', controller.createAdContent)
router.post('/createRequest', controller.createRequest)

module.exports = router;