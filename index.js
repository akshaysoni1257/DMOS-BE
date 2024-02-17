const express = require('express');
const database = require("./config/database");
const app = express();
require('dotenv').config()

app.use(express.urlencoded());
app.use(express.json());

/* Admin routes */
app.use('/user',require('./routes/user'));
app.use('/product',require('./routes/product'));
app.use('/category',require('./routes/category'));
app.use('/aboutus',require('./routes/aboutus'));
app.use('/tableRoutes',require('./routes/tableRoutes'));

module.exports = app;