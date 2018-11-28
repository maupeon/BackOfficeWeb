//RUTAS RENT
'use strict'

var express = require('express');
var rentController = require('../controllers/rent');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/rent', md_auth.ensureAuth, rentController.createRent);
api.get('/rent/:id', md_auth.ensureAuth, rentController.readRent);
api.get('/rents/:c_id?', md_auth.ensureAuth, rentController.readRents);
api.put('/deactivate-rent/:r_id', md_auth.ensureAuth, rentController.deactivateRent);

module.exports = api;
