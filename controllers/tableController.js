const qr = require('qrcode');
const fs = require('fs');
const path = require('path'); // Import the path module
const Table = require('../models/Table');

async function generateQRCodeForTable(tableNumber, storeLink) {
    const qrData = `${storeLink}/table/${tableNumber}`; // Combine store link with table number

    try {
        const qrCodeImage = await qr.toDataURL(qrData);
        const qrCodeFileName = `table_${tableNumber}_qr.png`;
        const uploadFolder = path.join(__dirname, '../upload'); // Path to the upload folder
        
        // Save QR code image in the upload folder
        fs.writeFileSync(path.join(uploadFolder, qrCodeFileName), qrCodeImage.split(';base64,').pop(), { encoding: 'base64' });

        // Save QR code data in MongoDB
        await Table.create({ number: tableNumber,storeLink:storeLink, qrCode: path.join('upload', qrCodeFileName) });

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
