const express = require('express');
const router = express.Router();
const controller = require("../../controllers/district/location.controller")
const auth = require("../../controllers/auth.controller");
const multer = require('multer');

const upload_ad_place = multer({
    dest: 'uploads/ad_place/'
})
const upload_ad = multer({
    dest: 'uploads/ads/'
})

router.get("/", auth.isLoggedIn, auth.isOfficer, controller.show)
router.post('/uploadUpdatePlace', upload_ad_place.array('imgFile', 2), controller.multipleFilesUpload);

module.exports = router