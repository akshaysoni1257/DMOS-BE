const express = require('express');
const routes = express.Router();
const adminregisterController = require('../controllers/user');

/*Admin register*/
routes.post('/adminregister',adminregisterController.adminregister);
routes.post('/adminLogin',adminregisterController.adminLogin);

// Forgot password route
routes.post('/forgot-password', adminregisterController.forgotPassword);

//Logout
routes.get('/logout',adminregisterController.logout);

/* Client Register & login */
routes.post('/customerregister',adminregisterController.customerregister);
routes.post('/customerLogin',adminregisterController.customerLogin);

module.exports = routes;
