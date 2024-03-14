const Category = require("../../models/AboutUs");


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