// controllers/statsController.js

const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Category = require('../../models/Category');
const Table = require('../../models/Qrcode');

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

exports.getRecentData = async (req, res) => {
  try {
    // Aggregate categories
    const recentCategories = await Category.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ]);

    // Aggregate products
    const recentProducts = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ]);

    // Aggregate QR codes
    const recentQRCodes = await Table.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      recentCategories,
      recentProducts,
      recentQRCodes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent data', error: error.message });
  }
};