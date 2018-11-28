//RUTAS CLIENT
'use strict'

var express = require('express');
var employeeController = require('../controllers/employee');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/employees'});

api.post('/employee', md_auth.ensureAuth,employeeController.createEmployee);
api.post('/employee-login', employeeController.loginEmployee);
//api.get('/employee/:id', md_auth.ensureAuth, employeeController.readEmployee);
api.get('/employee/:id', md_auth.ensureAuth, employeeController.readEmployee);
api.get('/employees', md_auth.ensureAuth, employeeController.readEmployees);
api.put('/employee/:id', md_auth.ensureAuth, employeeController.updateEmployee);
api.delete('/employee/:id', md_auth.ensureAuth, employeeController.deleteEmployee);
api.post('/upload-image-employee/:id', [md_auth.ensureAuth, md_upload] , employeeController.uploadImage);
api.get('/get-image-employee/:imageFile', md_auth.ensureAuth, employeeController.getImageFile);

/*DELETE AFTER UPLOAD*/
api.post('/admin', employeeController.createAdmin);

module.exports = api;

// -ed, -io, -lt, -or
