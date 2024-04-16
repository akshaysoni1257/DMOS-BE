// adminOrderRoutes.js

const express = require('express');
const router = express.Router();
const adminOrderController = require('../../controllers/admin/orderController');

// Get all customer orders
router.get('/orders', adminOrderController.getAllOrders);

// Get a specific order by ID
router.get('/getorder/:orderId', adminOrderController.getOrderById);

// Update an order
router.put('/updateorder/:orderId', adminOrderController.updateOrder);

// Delete an order
router.delete('/deleteorder/:orderId', adminOrderController.deleteOrder);

module.exports = router;
