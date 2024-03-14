const express = require('express');
const database = require("./config/admindb");
const app = express();
const cors = require("cors");
require('dotenv').config()

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());


app.use('/user',require('./routes/user'));
app.use('/customer/category',require('./routes/customer/category'));
app.use('/customer/product',require('./routes/customer/product'));
app.use('/customer/aboutus',require('./routes/customer/aboutus'));

module.exports = app;