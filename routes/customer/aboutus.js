const express = require('express');
const router = express.Router();
// const ProductController = require('../../controllers/customer/ProductController');



//get Categories
router.get('/getaboutus',ProductController.GetAboutus);

module.exports = router;