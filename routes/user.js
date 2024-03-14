const express = require('express');
const routes = express.Router();
const adminregisterController = require('../controllers/user');

/*Admin register*/
routes.post('/adminregister',adminregisterController.adminregister);
routes.get('/adminLogin',adminregisterController.adminLogin);


/* Client Register & login */
routes.post('/customerregister',adminregisterController.customerregister);
routes.post('/customerLogin',adminregisterController.customerLogin);

module.exports = routes;
