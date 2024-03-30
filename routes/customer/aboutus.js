const express = require('express');
const router = express.Router();
const AboutusController = require('../../controllers/customer/AboutusController');



//get Categories
router.get('/getaboutus',AboutusController.GetAboutus);

module.exports = router;