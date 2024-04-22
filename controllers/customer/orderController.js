const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const stripe = require('stripe')(process.env.Secret_key);

//Old code
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

//     // Check if total amount meets the minimum charge amount
//     const currency = 'inr'; // Change to your desired currency
//     const minimumChargeAmount = 0.50; // Adjust based on your currency's minimum charge amount
//     if (totalAmount < minimumChargeAmount) {
//       return res.status(400).json({ message: `Total amount is below the minimum charge amount of ${minimumChargeAmount} ${currency}` });
//     }

//     // Create a payment intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: currency,
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

//     res.status(201).json({ message: 'Order created successfully', order: newOrder, clientSecret: paymentIntent.client_secret,paymentIntentId: paymentIntent.id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//New code with stripe session checkout 1
// exports.createOrder = async (req, res) => {
//   try {
//     // Retrieve cart and calculate total amount
//     const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }
//     console.log(cart,"122121");
//     const orderItems = cart.items.map(item => ({
//       price_data: {
//         currency: 'inr', // Change to your desired currency
//         product_data: {
//           name: item.product.name, // Assuming product has a name attribute
//         },
//         unit_amount: item.product.price * 100, // Convert price to cents
//         quantity: item.quantity,
//       },
//     }));
//       console.log(orderItems,"3333333");


//     // Create a Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: orderItems,
//       mode: 'payment',
//       success_url: 'http://localhost:3002/success',
//       cancel_url: 'http://localhost:3002/cancel',
//     });

//     // Create order in your database
//     const newOrder = await Order.create({
//       customer: req.user.userId,
//       items: orderItems,
//       checkoutSessionId: session.id, // Store checkout session ID in the order
//     });

//     // Clear the cart after creating the order
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder, sessionId: session.id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//New code with stripe session checkout 2
// exports.createOrder = async (req, res) => {
//   try {
//     // Retrieve cart and calculate total amount
//     const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const lineItems = cart.items.map(item => ({
//       price: Math.round(item.product.price * 100), // Convert price to cents
//       quantity: item.quantity,
//       description: item.product.name, // Assuming product has a name attribute
//     }));

//     // Create a Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'https://yourwebsite.com/success',
//       cancel_url: 'https://yourwebsite.com/cancel',
//     });

//     // Create order in your database
//     const newOrder = await Order.create({
//       customer: req.user.userId,
//       items: cart.items,
//       checkoutSessionId: session.id, // Store checkout session ID in the order
//     });

//     // Clear the cart after creating the order
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({ message: 'Order created successfully', order: newOrder, sessionId: session.id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    // Retrieve cart and calculate total amount
    const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Create price objects for each product in the cart
    const priceIds = [];
    for (const item of cart.items) {
      const product = item.product;
      const price = await stripe.prices.create({
        unit_amount: product.price * 100, // Convert price to cents
        currency: 'inr', // Change to your desired currency
        product_data: {
          name: product.name, // Assuming product has a name attribute
        },
      });
      priceIds.push(price.id);
    }

    // Create a Checkout session with the created price objects
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map((item, index) => ({
        price: priceIds[index],
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://yourwebsite.com/success',
      cancel_url: 'https://yourwebsite.com/cancel',
    });

    // Create order in your database
    const newOrder = await Order.create({
      customer: req.user.userId,
      items: cart.items,
      checkoutSessionId: session.id, // Store checkout session ID in the order
    });

    // Clear the cart after creating the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder, sessionId: session.id });
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
  