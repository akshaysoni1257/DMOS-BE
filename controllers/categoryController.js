// controllers/categoryController.js
const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with the same name already exists" });
    }
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.getCategories = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
  
//       const skip = (page - 1) * limit;
  
//       const categories = await Category.find()
//         .skip(skip)
//         .limit(limit)
//         .exec();
  
//       const totalCount = await Category.countDocuments();
  
//       const totalPages = Math.ceil(totalCount / limit);
  
//       res.status(200).json({
//         categories,
//         pagination: {
//           totalPages,
//           currentPage: page,
//           totalRecords: totalCount,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1
//         }
//       });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
// };

exports.getCategories = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchQuery = req.query.searchkey || '';

      const skip = (page - 1) * limit;

      // Constructing the query based on search criteria
      const query = searchQuery ? { name: { $regex: searchQuery, $options: 'i' } } : {};

      const categories = await Category.find(query)
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

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteCategories = async (req, res) => {
    try {
      const { id } = req.body;
  
      // Check if categoryIds array is provided
      if (!id || !Array.isArray(id)) {
        return res.status(400).json({ message: 'Category IDs must be provided as an array' });
      }
  
      // Delete categories using categoryIds array
      const deletionResult = await Category.deleteMany({ _id: { $in: id } });
  
      // Check if any categories were deleted
      if (deletionResult.deletedCount === 0) {
        return res.status(404).json({ message: 'No categories found for deletion' });
      }
  
      res.status(200).json({ message: 'Categories deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
