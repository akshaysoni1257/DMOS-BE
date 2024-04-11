const qr = require('qrcode');
const fs = require('fs');
const path = require('path'); // Import the path module
const Table = require('../../models/Qrcode');
const cloudinary = require('cloudinary').v2;

// async function generateQRCodeForTable(tableNumber, storeLink) {
//     const qrData = `${storeLink}/table/${tableNumber}`; // Combine store link with table number

//     try {
//         const qrCodeImage = await qr.toDataURL(qrData);
//         const qrCodeFileName = `table_${tableNumber}_qr.png`;
//         const uploadFolder = path.join(__dirname,'../../../DMOS-BE/upload'); // Path to the upload folder
        
//         // Save QR code image in the upload folder
//         fs.writeFileSync(path.join(uploadFolder, qrCodeFileName), qrCodeImage.split(';base64,').pop(), { encoding: 'base64' });

//         // Save QR code data in MongoDB
//         await Table.create({ number: tableNumber,storeLink:storeLink, qrCode: path.join('upload', qrCodeFileName) });

//         console.log(`QR code for Table ${tableNumber} generated and saved successfully!`);
//     } catch (error) {
//         console.error(`Error generating QR code for Table ${tableNumber}: ${error.message}`);
//     }
// }

async function generateQRCodeForTable(tableNumber, storeLink) {
    const qrData = `${storeLink}/table/${tableNumber}`; // Combine store link with table number

    try {
        const qrCodeImage = await qr.toDataURL(qrData);
        const qrCodeFileName = `table_${tableNumber}_qr.png`;
        const uploadFolder = path.join(__dirname, '../../../DMOS-BE/upload'); // Path to the upload folder
        
        // Save QR code image in the upload folder
        fs.writeFileSync(path.join(uploadFolder, qrCodeFileName), qrCodeImage.split(';base64,').pop(), { encoding: 'base64' });

        // Upload QR code image to Cloudinary
        const cloudinaryUploadResult = await cloudinary.uploader.upload(path.join(uploadFolder, qrCodeFileName));

        // Save QR code data in MongoDB with Cloudinary URL
        await Table.create({ 
            number: tableNumber,
            storeLink: storeLink,
            qrCode: cloudinaryUploadResult.secure_url // Save Cloudinary URL
        });

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

async function getQRCodeDetails() {
    try {
        const qrCodeDetails = await Table.find();
        return qrCodeDetails;
    } catch (error) {
        throw error;
    }
}


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Controller function to handle image upload
const uploadImage = (req, res) => {
  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
    }
    res.status(200).json({ imageUrl: result.secure_url });

  }).end(req.file.buffer);
};


module.exports = {
    generateQRCodeForTable,
    getQRCodeDetailsById,
    uploadImage,
    getQRCodeDetails
};
