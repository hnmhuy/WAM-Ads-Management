const express = require('express');
const router = express.Router();
const controller = require("../../api/feedback")
const multer = require("multer");
const upload = multer({
    dest: 'uploads/'
});


router.post('/reCaptcha', controller.reCaptcha);
router.post('/sendFeedback',upload.array("imgFile", 2), controller.sendFeedback);


module.exports = router;