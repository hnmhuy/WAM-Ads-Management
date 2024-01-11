const express = require('express');
const router = express.Router();
const controller = require('../../api/mapData');
const multer = require('multer');
const upload = multer({ dest: 'uploads/'});

router.get('/get', controller.get);
router.get('/getData', controller.getData)
router.get('/getOnlyAd', controller.getOnlyAd);
router.post('/restoreUserFeedback', upload.none(), controller.restoreUserFeedback);

module.exports = router;