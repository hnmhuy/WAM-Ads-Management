const epxress = require('express');
const router = epxress.Router();
const controller = require('../../api/ad_place');
const multer = require('multer');
const upload = multer({dest: 'uploads/ad_place'});

router.get('/get', controller.getAdPlace);
router.get('/getGeojson', controller.getAdPlaceGeojson);
router.get('/delete', controller.deleteAdPlace);
router.get('/getOne', controller.getOneAdPlace);
router.post('/create', upload.array("imgFile", 2), controller.createAdPlace);


module.exports = router;