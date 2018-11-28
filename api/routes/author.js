//RUTAS AUTHOR
'use strict'

var express = require('express');
var authorController = require('../controllers/author');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/authors'});

api.post('/author', md_auth.ensureAuth, authorController.createAuthor);
api.get('/author/:id', md_auth.ensureAuth, authorController.readAuthor);
api.get('/authors', md_auth.ensureAuth, authorController.readAuthors);
api.put('/author/:id/:admin', md_auth.ensureAuth, authorController.updateAuthor);
api.delete('/author/:id/:admin', md_auth.ensureAuth, authorController.deleteAuthor);
api.post('/upload-image-author/:id', [md_auth.ensureAuth, md_upload] , authorController.uploadImage);
api.get('/get-image-author/:imageFile', authorController.getImageFile);

//GET REGISTERS OF AUTHORS
api.get('/ca-register/:id?', md_auth.ensureAuth, authorController.readCreationsAuthor);
api.get('/ca-employee-register/:employee', md_auth.ensureAuth, authorController.readCreationsAuthorByEmployee);
api.get('/ua-register/:id?', md_auth.ensureAuth, authorController.readUpdatesAuthor);
api.get('/ua-employee-register/:employee', md_auth.ensureAuth, authorController.readUpdatesAuthorByEmployee);
api.get('/da-register/:id?', md_auth.ensureAuth, authorController.readDeletionsAuthor);
api.get('/da-employee-register/:employee', md_auth.ensureAuth, authorController.readDeletesAuthorByEmployee);


module.exports = api;
