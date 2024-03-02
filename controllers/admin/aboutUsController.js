// controllers/aboutUsController.js

const AboutUs = require("../../models/AboutUs");

// Create AboutUs
module.exports.createAboutUs = async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const aboutUs = new AboutUs({ title, content, images });
    await aboutUs.save();
    res.status(201).json({ message: "AboutUs created successfully", aboutUs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all AboutUs with pagination and search
module.exports.getAllAboutUs = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.searchkey || '';
  
      const skip = (page - 1) * limit;
  
      let query = {};
  
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      const aboutUsList = await AboutUs.find(query)
        .skip(skip)
        .limit(limit);
      
      const totalCount = await AboutUs.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);
  
      res.status(200).json({
        aboutUsList,
        pagination: {
          totalPages,
          currentPage: page,
          totalRecords: totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get AboutUs by ID
module.exports.getAboutUsById = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findById({_id:req.params.id});
    if (!aboutUs) {
      return res.status(404).json({ message: "AboutUs not found" });
    }
    res.status(200).json(aboutUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update AboutUs
module.exports.updateAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!aboutUs) {
      return res.status(404).json({ message: "AboutUs not found" });
    }
    res.status(200).json({ message: "AboutUs updated successfully", aboutUs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete AboutUs
module.exports.deleteAboutUs = async (req, res) => {
    try {
      const { id } = req.body;
  
      if (!id || !Array.isArray(id)) {
        return res.status(400).json({ message: "Invalid input. IDs must be provided as an array." });
      }
  
      const deletionPromises = id.map(async (id) => {
        const aboutUs = await AboutUs.findByIdAndDelete(id);
        if (!aboutUs) {
          return { id, message: "AboutUs not found" };
        }
        return { id, message: "AboutUs deleted successfully" };
      });
  
      const deletionResults = await Promise.all(deletionPromises);
  
      res.status(200).json({message: "AboutUs deleted successfully"});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
