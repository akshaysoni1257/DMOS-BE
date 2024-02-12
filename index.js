const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const database = require("./config/database");
const app = express();
const port = 9000;
require('dotenv').config()
app.use(express.urlencoded());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
}))
app.post('/imageupload', (req, res) => {
    const file  = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath,(error,result)=>{
        if(error){
            console.log("error: " + error);
        }
        res.json(result);
    });
})

cloudinary.config({ 
    cloud_name:process.env.cloud_name, 
    api_key:process.env.api_key, 
    api_secret:process.env.api_secret
  });
app.listen(port,(error)=>{
    if(error){
        console.log("Server error: " + error);
    }
    console.log("Server listening on port " + port);
});