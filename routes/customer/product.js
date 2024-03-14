const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/customer/ProductController');



//get Categories
router.get('/getCustomerProducts',ProductController.GetCustomerProducts);
router.get('/getCustomerProduct/:id',ProductController.GetCustomerProduct);

module.exports = router;