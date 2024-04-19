// controllers/statsController.js

const Product = require('../../models/Product');
const Order = require('../../models/Order');

exports.getStatistics = async (req, res) => {
  try {
    const categoryCount = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const productCount = await Product.countDocuments();

    const totalPayment = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      categoryCount,
      productCount,
      totalPayment: totalPayment.length > 0 ? totalPayment[0].total : 0,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
