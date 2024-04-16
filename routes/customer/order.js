const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/customer/orderController');
const verifyToken = require('../../middleware/customerauth');


// Create order route
router.post('/create-order', verifyToken, orderController.createOrder);

// View orders route
router.get('/view-orders', verifyToken, orderController.viewOrders);

// Update order route
router.put('/update-order/:orderId', verifyToken, orderController.updateOrder);

// Delete order route
router.delete('/delete-order/:orderId', verifyToken, orderController.deleteOrder);

module.exports = router;
