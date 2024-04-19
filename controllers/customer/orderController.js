const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const stripe = require('stripe')(process.env.Secret_key);

exports.createOrder = async (req, res) => {
  try {
    // Retrieve cart and calculate total amount
    const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    }));

    // Calculate total amount from cart items
    const totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Check if total amount meets the minimum charge amount
    const currency = 'inr'; // Change to your desired currency
    const minimumChargeAmount = 0.50; // Adjust based on your currency's minimum charge amount
    if (totalAmount < minimumChargeAmount) {
      return res.status(400).json({ message: `Total amount is below the minimum charge amount of ${minimumChargeAmount} ${currency}` });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: currency,
      metadata: { integration_check: 'accept_a_payment' }
    });
    console.log(paymentIntent.id);
    // Create order in your database
    const newOrder = await Order.create({
      customer: req.user.userId,
      items: orderItems,
      paymentIntentId: paymentIntent.id // Store payment intent ID in the order
    });

    // Clear the cart after creating the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// exports.createOrder = async (req, res) => {
//   try {
//     // Retrieve cart and calculate total amount
//     const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const orderItems = cart.items.map(item => ({
//       product: item.product._id,
//       quantity: item.quantity,
//       totalPrice: item.totalPrice
//     }));

//     // Calculate total amount from cart items
//     const totalAmount = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);

//     // Create a payment intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: 'INR',
//       metadata: { integration_check: 'accept_a_payment' }
//     });

//     // Create order in your database
//     const newOrder = await Order.create({
//       customer: req.user.userId,
//       items: orderItems,
//       paymentIntentId: paymentIntent.id // Store payment intent ID in the order
//     });

//     // Clear the cart after creating the order
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder, clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const orderItems = cart.items.map(item => ({
//       product: item.product._id,
//       quantity: item.quantity,
//       totalPrice: item.totalPrice
//     }));

//     const newOrder = await Order.create({
//       customer: req.user.userId,
//       items: orderItems
//     });

//     // Clear the cart after creating the order
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({order: newOrder , message: 'Order created successfully', });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.viewOrders = async (req, res) => {
    try {
      const orders = await Order.find({ customer: req.user.userId });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.updateOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const updates = req.body;
  
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  exports.deleteOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  