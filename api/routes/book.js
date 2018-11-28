//RUTAS AUTHOR
'use strict'

var express = require('express');
var bookController = require('../controllers/book');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_image_upload = multipart({uploadDir: './uploads/books/images'});
var md_file_upload = multipart({uploadDir: './uploads/books/files'});

api.post('/book', md_auth.ensureAuth, bookController.createBook);
api.get('/book/:id', md_auth.ensureAuth, bookController.readBook);
api.get('/books', md_auth.ensureAuth, bookController.readBooks);
api.put('/book/:id', md_auth.ensureAuth, bookController.updateBook);
api.delete('/book/:id', md_auth.ensureAuth, bookController.deleteBook);
api.post('/image-book/:id', [md_auth.ensureAuth, md_image_upload] , bookController.uploadImage);
api.get('/image-book/:imageFile', md_auth.ensureAuth, bookController.getImageFile);
api.post('/file-book/:id', [md_auth.ensureAuth, md_file_upload] , bookController.uploadBookFile);
api.get('/file-book/:bookFile', bookController.getBookFile);


//GET REGISTERS OF AUTHORS
/*
api.get('/cb-register/:id?', md_auth.ensureAuth, bookController.readCreationsBook);
api.get('/cb-employee-register/:employee', md_auth.ensureAuth, bookController.readCreationsBooksByEmployee);
api.get('/ub-register/:id?', md_auth.ensureAuth, bookController.readUpdatesBook);
api.get('/ub-employee-register/:employee', md_auth.ensureAuth, bookController.readUpdatesBookByEmployee);
api.get('/db-register/:id?', md_auth.ensureAuth, bookController.readDeletionsBook);
api.get('/db-employee-register/:employee', md_auth.ensureAuth, bookController.readDeletesBookByEmployee);
*/

module.exports = api;
