const qr = require('qrcode');
const fs = require('fs');
const Table = require('../models/Table');

async function generateQRCodeForTable(tableNumber) {
    const qrData = `Table ${tableNumber} QR Code`;

    try {
        const qrCodeImage = await qr.toDataURL(qrData);
        const qrCodeFileName = `table_${tableNumber}_qr.png`;
        
        fs.writeFileSync(qrCodeFileName, qrCodeImage.split(';base64,').pop(), { encoding: 'base64' });

        // Save QR code data in MongoDB
        await Table.create({ number: tableNumber, qrCode: qrCodeFileName });

        console.log(`QR code for Table ${tableNumber} generated and saved successfully!`);
    } catch (error) {
        console.error(`Error generating QR code for Table ${tableNumber}: ${error.message}`);
    }
}

async function getQRCodeDetailsById(qrCodeId) {
    try {
        const qrCodeDetails = await Table.findById(qrCodeId);
        return qrCodeDetails;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateQRCodeForTable,
    getQRCodeDetailsById
};
