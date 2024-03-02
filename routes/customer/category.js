const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/customer/CategoryController');



//get Categories
router.get('/getCustomerCategories',CategoryController.getCustomerCategories);

module.exports = router;
