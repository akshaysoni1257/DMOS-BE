const express = require('express');
const database = require("./config/admindb");
const app = express();
const cors = require("cors");
require('dotenv').config()


app.use(express.urlencoded());
app.use(express.json());
app.use(cors());


/* Admin routes */
app.use('/user',require('./routes/user'));
app.use('/admin/product',require('./routes/admin/product'));
app.use('/admin/category',require('./routes/admin/category'));
app.use('/admin/aboutus',require('./routes/admin/aboutus'));
app.use('/admin/tableRoutes',require('./routes/admin/qrcode'));

module.exports = app;