const express = require('express');
const router = express.Router();
const controller = require("../../api/feedback")
const multer = require("multer");
const storage = multer.diskStorage({
    destination: 'uploads/',
});

const upload = multer({storage: storage});



router.post('/reCaptcha', controller.reCaptcha);
router.post('/sendFeedback',upload.array("imgFile", 2), controller.sendFeedback);
router.get('/getFeedback', controller.getFeedback);
router.get('/getResponse', controller.getResponse);

module.exports = router;