const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const verifyToken = require('../../middleware/authMiddleware');




//Admin
router.post('/addCategories',verifyToken, categoryController.createCategory);
router.get('/getCategories', verifyToken,categoryController.getCategories);
router.get('/getCategory/:id', verifyToken,categoryController.getCategory);
router.put('/updateCategories/:id', verifyToken,categoryController.updateCategory);
router.delete('/deleteCategories',verifyToken, categoryController.deleteCategories);

module.exports = router;
