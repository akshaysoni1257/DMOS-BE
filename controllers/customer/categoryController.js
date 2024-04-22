// controllers/categoryController.js
const Category = require("../../models/Category");

exports.getCustomerCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.searchkey || '';

    const skip = (page - 1) * limit;

    // Constructing the query based on search criteria
    const query = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
    const categories = await Category.find()
    .skip(skip)
    .limit(limit)
    .exec();
    const totalCount = await Category.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      categories,
      pagination: {
          totalPages,
          currentPage: page,
          totalRecords: totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomerCategory = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategorywiseproducts = async (req,res) => {
  try {
    const category = req.params.categoryName;
    const filteredData = allData.filter(item => item.category === category);
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
