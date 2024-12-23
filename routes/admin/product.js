const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

const verifyToken = require('../../middleware/authMiddleware');


router.post('/addProducts',verifyToken, productController.createProduct);
router.get('/getProducts',verifyToken, productController.GetProducts);
router.get('/getProduct/:id',verifyToken, productController.GetProduct);
router.put('/updateProduct/:id',verifyToken, productController.UpdateProduct);
router.post('/deleteProduct',verifyToken, productController.DeleteProduct);

// Route for handling image uploads
// router.post('/upload', productController.uploadImage);



module.exports = router;
