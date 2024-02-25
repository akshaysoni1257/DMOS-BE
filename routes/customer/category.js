const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/customer/categoryController');
const verifyCustomerToken = require('../../middleware/authcusMiddleware');


//get Categories
router.get('/getCategories', verifyCustomerToken,categoryController.getCategories);

module.exports = router;
