// controllers/productController.js
const Product = require("../../models/Product");

const cloudinary = require('cloudinary').v2; // Import Cloudinary library

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createProduct = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const existingProduct = await Product.findOne({ name: req.body.name, clientId });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with the same name already exists" });
    }

    let imageUrl;
    if (req.body.img) {
      const result = await cloudinary.uploader.upload(req.body.img);
      imageUrl = result.secure_url;
    }

    // Create the product with the provided data and the Cloudinary image URL if available
    const product = await Product.create({
      ...req.body,
      imageUrl: imageUrl // Add the Cloudinary image URL to the product data
    });
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.createProduct = async (req, res) => {
//   try {
//     const clientId = req.user.userId;
//     const existingProduct = await Product.findOne({ name: req.body.name,clientId });
//     if (existingProduct) {
//       return res
//         .status(400)
//         .json({ message: "Product with the same name already exists" });
//     }
//     const product = await Product.create(req.body);
//     res.status(201).json({ product });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

exports.GetProducts = async (req, res) => {
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

exports.GetProduct = async (req, res) => {
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

exports.UpdateProduct = async (req, res) => {
  try {
    // const { name, description, price, quantity } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ updatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !Array.isArray(id)) {
      return res
        .status(400)
        .json({ message: "Product IDs must be provided as an array" });
    }

    const deletionResult = await Product.deleteMany({
      _id: { $in: id },
    });

    if (deletionResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No products found for deletion" });
    }

    res.status(200).json({ message: "Products deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Controller function to handle image upload
// const uploadImage = async (req, res) => {
//     try {
//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.buffer, {
//             resource_type: 'image'
//         });

//         // Return Cloudinary response
//         res.json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };

// module.exports = {
//     uploadImage
// };

