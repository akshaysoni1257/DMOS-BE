const express = require('express');
const routes = express.Router();
const adminregisterController = require('../controllers/adminregister');

/*Admin register*/
routes.post('/adminregister',adminregisterController.adminregister);
routes.get('/adminLogin',adminregisterController.adminLogin);


/* Client Register & login */
module.exports = routes;
