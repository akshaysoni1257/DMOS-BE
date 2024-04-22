const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

//add cart
exports.addToCart = async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1;

    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate the total price for the specified quantity
    const totalPrice = product.price * quantity;

    let cart = await Cart.findOne({ customer: req.user.userId });

    if (!cart) {
      cart = new Cart({
        customer: req.user.userId,
        items: []
      });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice += totalPrice; // Update the total price for existing items
    } else {
      cart.items.push({ product: productId, quantity, totalPrice });
    }

    await cart.save();
    res.status(200).json({ cart,message: 'Product added to cart successfully'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//view cart
exports.viewCart = async (req, res) => {
  try {
    // Retrieve cart with populated product details
    const cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');

    // Calculate total price of all items
    let totalPriceOfAllItems = 0;

    cart.items.forEach(item => {
      const itemPrice = item.product.price * item.quantity;
      totalPriceOfAllItems += itemPrice;
      // Add the individual item price to the item object
      item.totalPrice = itemPrice;
    });
    
    // Calculate cart total
    let carttotal = 0;
    for (let item of cart.items){
      carttotal += item.totalPrice;
    } 

    // Add the total price of all items to the cart object
    cart.totalPriceOfAllItems = totalPriceOfAllItems;

    // Add cart total to the cart object
    cart.carttotal = carttotal;

    //Save the updated cart (optional if there are no other changes to save)
    await cart.save();
      
    // Send the updated cart to the client
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update cart
exports.updateCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    let cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItem = cart.items.find(item => item.product._id.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    existingItem.quantity = quantity;
    existingItem.totalPrice = existingItem.product.price * quantity; // Recalculate total price
    await cart.save();

    res.status(200).json({cart,message: 'Cart updated successfully'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//Delete a Cart
exports.deleteCartProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    let cart = await Cart.findOne({ customer: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ cart,message: 'Product removed from cart successfully'});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// View cart
exports.clearCart = async (req, res) => {
  try {
    // Find the cart for the current user and populate the items
    let cart = await Cart.findOne({ customer: req.user.userId }).populate('items.product');

    // Remove all products from the cart by emptying the items array
    cart.items = [];

    // Save the changes
    await cart.save();

    // Return an empty cart
    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


