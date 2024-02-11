const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const app = express();
const port = 9000;

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
    cloud_name: 'dqx0cucjk', 
    api_key: '254328871597427', 
    api_secret: 'JKOC_xgC3jVwT8QQBinzLGOTVY8'
  });
app.listen(port,(error)=>{
    if(error){
        console.log("Server error: " + error);
    }
    console.log("Server listening on port " + port);
});