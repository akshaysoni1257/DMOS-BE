// controllers/categoryController.js
const Category = require("../../models/Category");

exports.getCustomerCategories = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const searchQuery = req.query.searchkey || '';

    // const skip = (page - 1) * limit;

    // Constructing the query based on search criteria
    // const query = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};
    // console.log(query,"1111111");
    const categories = await Category.find();
    // .skip(skip)
    // .limit(limit)
    // .exec();
    console.log(categories, "rrrrrrrrrrr");
    // const totalCount = await Category.countDocuments(query);

    // const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      categories,
      // pagination: {
      //     totalPages,
      //     currentPage: page,
      //     totalRecords: totalCount,
      //     hasNextPage: page < totalPages,
      //     hasPrevPage: page > 1
      // }
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: err.message });
  }
};
exports.getCategory = async (req, res) => {
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
