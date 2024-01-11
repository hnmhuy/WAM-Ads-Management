const express = require('express');
const router = express.Router();
const controller = require('../../api/create_request');
const multer = require('multer');   
const upload = multer({ dest: 'uploads/' });


router.get('/getAmountByAdPlace', controller.getAmountByAdPlace);
router.get('/getListOfRequest', controller.getListOfRequest);
router.get('/getOneRequest', controller.getOneRequest);
router.post('/resolveRequest', upload.none(), controller.resolveRequest);

module.exports = router;