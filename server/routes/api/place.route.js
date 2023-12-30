const express = require('express');
const router = express.Router();
const controller = require('../../api/place');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.post('/create', upload.none(), controller.createPlace);

module.exports = router;