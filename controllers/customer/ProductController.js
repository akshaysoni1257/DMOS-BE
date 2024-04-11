const Product = require("../../models/Product");


exports.GetCustomerProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit);
  
      const skip = (page - 1) * limit;
  
      const products = await Product.find().skip(skip).limit(limit).exec();
  
      const totalCount = await Product.countDocuments();
  
      const totalPages = Math.ceil(totalCount / limit);
  
      res.status(200).json({
        products,
        pagination: {
          totalPages,
          currentPage: page,
          totalRecords: totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.GetCustomerProduct = async (req, res) => {
    try {
      const product = await Product.findById({ _id: req.params.id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };