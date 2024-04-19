// routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const statsController = require('../../controllers/admin/statsController');

// Get statistics
router.get('/stats', statsController.getStatistics);

module.exports = router;
