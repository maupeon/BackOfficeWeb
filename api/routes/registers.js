//RUTAS RENT
'use strict'

var express = require('express');
var registerController = require('../controllers/registers');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

//api.post('/rent/:c_id', md_auth.ensureAuth, rentController.createRent);
api.get('/cb-register/:id', md_auth.ensureAuth, registerController.readCreatedBook);
api.get('/cb-registers/:e_id?', md_auth.ensureAuth, registerController.readCreatedBooks);
api.get('/ub-register/:id', md_auth.ensureAuth, registerController.readUpdatedBook);
api.get('/ub-registers/:e_id?', md_auth.ensureAuth, registerController.readUpdatedBooks);
api.get('/db-register/:id', md_auth.ensureAuth, registerController.readDeletedBook);
api.get('/db-registers/:e_id?', md_auth.ensureAuth, registerController.readDeletedBooks);

//api.get('/rents/:status/:c_id?', md_auth.ensureAuth, rentController.readRents);
//api.put('/deactivate-rent/:r_id', md_auth.ensureAuth, rentController.deactivateRent);

module.exports = api;
