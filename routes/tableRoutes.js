const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const verifyToken = require('../middleware/authMiddleware');

// Generate QR code for a table
router.post('/generateQR/:tableNumber', async (req, res) => {
    const tableNumber = req.params.tableNumber;

    try {
        await tableController.generateQRCodeForTable(tableNumber);
        res.status(200).send(`QR code generated and saved for Table ${tableNumber}`);
    } catch (error) {
        res.status(500).send(`Error generating QR code for Table ${tableNumber}`);
    }
});

// Get QR code details by ID
router.get('/qrCode/:id', async (req, res) => {
    const qrCodeId = req.params.id;

    try {
        const qrCodeDetails = await tableController.getQRCodeDetailsById(qrCodeId);
        if (!qrCodeDetails) {
            return res.status(404).send('QR code not found');
        }
        res.status(200).json(qrCodeDetails);
    } catch (error) {
        res.status(500).send('Error fetching QR code details');
    }
});
module.exports = router;
