// controllers/statsController.js

const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Category = require('../../models/Category');

exports.getStatistics = async (req, res) => {
  try {
    const categoryCount = await Category.aggregate([
      { $group: { _id: null, count: { $sum: 1 } } }
  ]);
  
  const numberOfCategories = categoryCount.length > 0 ? categoryCount[0].count : 0;

    const productCount = await Product.countDocuments();

    const totalPayment = await Order.aggregate([
      { $unwind: '$items' }, // Unwind the items array
      { $group: { _id: null, total: { $sum: '$items.totalPrice' } } }
    ]);
    

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      numberOfCategories,
      productCount,
      totalPayment: totalPayment.length > 0 ? totalPayment[0].total : 0,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};
