const express = require('express');
const router = express.Router();
const tableController = require('../../controllers/admin/qrcodecontroller');
const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Generate QR code for a table
router.post('/generateQR/:tableNumber', async (req, res) => {
    console.log(req.params,"11111");
    console.log(req.body,"222222");
    const tableNumber = req.params.tableNumber;
    const storeLink = process.env.storeLink;

    try {
        await tableController.generateQRCodeForTable(tableNumber,storeLink);
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

// Get QR code details by ID
router.get('/qrCodes', async (req, res) => {
    try {
        const qrCodeDetails = await tableController.getQRCodeDetails();
        if (!qrCodeDetails) {
            return res.status(404).send('QR code not found');
        }
        res.status(200).json(qrCodeDetails);
    } catch (error) {
        res.status(500).send('Error fetching QR code details');
    }
});



// Define upload route
router.post('/upload', upload.single('image'), tableController.uploadImage);

module.exports = router;
