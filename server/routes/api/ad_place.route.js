const epxress = require('express');
const router = epxress.Router();
const controller = require('../../api/ad_place');
const multer = require('multer');
const upload = multer({dest: 'uploads/ad_place'});

router.post('/create', upload.array("imgFile"), controller.createAdPlace);

module.exports = router;