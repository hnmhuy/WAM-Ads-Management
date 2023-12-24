const express = require("express");
const router = express.Router();
const categoryController = require("../../api/category");

router.get('/restoreField', categoryController.restoreField);
router.get('/getField', categoryController.getField);
router.get('/getCategory', categoryController.getCategory);
router.post('/createCategory', categoryController.createCategory);
router.post('/updateCategory', categoryController.updateCategory);
module.exports = router;