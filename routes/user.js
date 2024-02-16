const express = require('express');
const routes = express.Router();
const adminregisterController = require('../controllers/adminregister');


routes.post('/adminregister',adminregisterController.adminregister);
routes.get('/adminLogin',adminregisterController.adminLogin);
module.exports = routes;
