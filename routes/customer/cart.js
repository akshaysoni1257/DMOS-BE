const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/customer/cartController');
const verifyToken = require('../../middleware/customerauth');


// Add to cart route
router.post('/add-to-cart', verifyToken,cartController.addToCart);
router.get('/view-cart', verifyToken, cartController.viewCart);
// Update cart route
router.put('/update-cart/:productId', verifyToken, cartController.updateCart);
// Delete cart product route
router.delete('/delete-cart/:productId', verifyToken, cartController.deleteCartProduct);

//all clear cart
router.delete('/clear-cart', verifyToken, cartController.clearCart);
module.exports = router;
