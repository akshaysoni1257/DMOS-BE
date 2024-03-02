const express = require('express');
const router = express.Router();
const aboutUsController = require('../../controllers/admin/aboutUsController');
const verifyToken = require('../../middleware/authMiddleware');


// Create AboutUs
router.post('/addAboutus',verifyToken, aboutUsController.createAboutUs);

// Get all AboutUs
router.get('/getAboutUs',verifyToken, aboutUsController.getAllAboutUs);

// Get AboutUs by ID
router.get('/getAboutus/:id', verifyToken,aboutUsController.getAboutUsById);

// Update AboutUs
router.put('/updateAboutus/:id', verifyToken,aboutUsController.updateAboutUs);


// Delete AboutUs
// router.post('deleteAboutus',verifyToken,aboutUsController.deleteAboutUs);
router.post('/deleteAboutus',verifyToken, aboutUsController.deleteAboutUs);


module.exports = router;