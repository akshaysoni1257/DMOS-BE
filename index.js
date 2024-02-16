const express = require('express');
const database = require("./config/database");
const app = express();
const port = 9000;

require('dotenv').config()

app.use(express.urlencoded());
app.use(express.json());

app.use('/user',require('./routes/user'));
app.use('/product',require('./routes/product'));
app.use('/category',require('./routes/category'));

app.listen(port,(error)=>{
    if(error){
        console.log("Server error: " + error);
    }
    console.log("Server listening on port " + port);
});