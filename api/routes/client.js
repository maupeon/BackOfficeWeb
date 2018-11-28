//RUTAS CLIENT
'use strict'

var express = require('express');
var clientController = require('../controllers/client');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/clients'});

api.post('/client',clientController.createClient);
api.post('/client-login', clientController.loginClient);
api.get('/client/:id', md_auth.ensureAuth, clientController.readClient);
api.get('/clients', md_auth.ensureAuth, clientController.readClients);
api.put('/client/:id', md_auth.ensureAuth, clientController.updateClient);
api.delete('/client/:id', md_auth.ensureAuth, clientController.deleteClient);
api.post('/upload-image-client/:id', [md_auth.ensureAuth, md_upload] , clientController.uploadImage);
api.get('/get-image-client/:imageFile', clientController.getImageFile);


//GET REGISTERS OF THE CLIENTS
/*
api.get('/cc-register/:id?', md_auth.ensureAuth, clientController.readCreationsClient);
api.get('/uc-register/:id?', md_auth.ensureAuth, clientController.readUpdatesClient);
api.get('/dc-register/:id?', md_auth.ensureAuth, clientController.readDeletionsClient);
*/
module.exports = api;
