const Order = require('../../models/Order');

// Get all customer orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'items.product',
      model: 'products',
      select: 'name price quantity img'
    }).populate('customer', 'first_name last_name email');
    
     // Iterate over each order
     orders.forEach(order => {
      let totalOrderPrice = 0;

      // Iterate over each item in the order and accumulate the total price
      order.items.forEach(item => {
        totalOrderPrice += item.totalPrice;
      });

      // Add the totalOrderPrice to the order object
      order.totalOrderPrice = totalOrderPrice;
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updates = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
