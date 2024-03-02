const express = require('express');
const database = require("./config/customerdb");
const app = express();
require('dotenv').config()

app.use(express.urlencoded());
app.use(express.json());


app.use('/user',require('./routes/user'));
app.use('/customer/category',require('./routes/customer/category'));

module.exports = app;