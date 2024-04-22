const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Assuming you have a Customer model
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products', // Assuming you have a Product model
      required: true
    },
    quantity: {
      type: Number,
      default: 1 // Default quantity is 1 if not provided
    },
    totalPrice:{type:Number}
  }],
  carttotal :{
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
