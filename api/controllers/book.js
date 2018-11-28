//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Book = require('../models/book');
var Author = require('../models/author');
var CBook = require('../models/c_book');
var UBook = require('../models/u_book');
var DBook = require('../models/d_book');


var bookController = {};

//CREATE A BOOK
/*
Function used to create a book
This function returns the created book (as a JSON OBJECT)

IMPLEMENTED WITH post
in header send the next params
  Autorization: token_of_the_admin

in the request parameters send the next atributes in the express url
NONE

in the request body send the next parameters
  title: string
  description: string
  genre: string
  year: number
  pages: number
  editorial: string
  total: number
*/
bookController.createBook = (req, res) => {

  console.log('CREATE BOOK REQ');

  var book = new Book();
  var employeeId = req.params.admin;

  var params = req.body;
  book.title = params.title;
  book.description = params.description;
  book.genre = params.genre;
  book.year = params.year;
  book.pages = params.pages;
  book.editorial = params.editorial;
  book.total = params.total;
  book.onloan = 0;
  book.inhouse = params.total;
  book.type = params.type;
  book.author = params.author;
  book.status = 'ACTIVE';
  book.image = '';
  book.file = '';

  if (!book.title || !book.description || !book.genre || !book.year || !book.pages || !book.editorial || !book.total || !book.author) {
    res.send({message: 'LLENE TODOS LOS CAMPOS'});

  } else {
    book.save((err, bookStored) => {
      if (err) {
        res.status(500).send({message: 'ERROR AL GUARDAR LIBRO'});
      } else {
        if (!bookStored) {
          res.status(404).send({message: 'EL LIBRO NO HA SIDO GUARDADO'});
        } else {
          res.send(bookStored);
        }
      }
    });
  }
}

//GET A BOOK
/*
Function that returns a BOOK (as a JSON object)

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory) //ALL USERS (ADMIN, EMPLOYEE & CLIENTS) CAN GET A BOOK.

in the request parameters send the next atributes in the express url
  id: id (this is mandatory) -> id of the book
*/
bookController.readBook = (req, res) => {

  console.log('GET BOOK REQ');

  var bookId = req.params.id;

  Book.findById(bookId).exec((err, book) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!book) {
        res.status(404).send({message: 'EL LIBRO NO EXISTE'});
      } else {
        res.status(200).send(book);
      }
    }
  });
}



//GET BOOKS
/*
Function that returns the number and a lsit of active books (as a JSON object)

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory) //ALL USERS (ADMIN, EMPLOYEE & CLIENTS) CAN GET BOOKS

in the request parameters send the next atributes in the express url
  author: id_of_author (this is not mandatory) -> used to get the list of books by author
*/
bookController.readBooks = (req, res) => {

  console.log('BOOKS REQ');

  Book.find({status: 'ACTIVE'}).sort('title').exec((err, books) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!books) {
        res.status(404).send({message: 'NO HAY LIBROS'});
      } else {
        res.json(books);
      }
    }
  });
}

//UPDATE BOOK
/*
Function that updates and returns the updated book (as a JSON object)

IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_book_to_update (this is mandatory)

in the reques body send the parameters that will be updated
*/
bookController.updateBook = (req, res) => {

  console.log('UPDATE BOOK REQ');

  var bookId = req.params.id;
  var update = req.body;

  Book.findByIdAndUpdate(bookId, update, (err, bookUpdated) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ACTUALIZAR LIBRO'});
    } else {
      if (!bookUpdated) {
        res.status(404).send({message: 'EL LIBRO NO HA SIDO ACTUALIZADO'});
      } else {

        Book.findOne({_id: bookId}, (err, upBook) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});

          } else {
            if (!upBook) {
              res.status(404).send({message: 'EL LIBRO NO EXISTE'});

            } else {
              res.status(200).send(upBook);
            }
          }
        });
      }
    }
  });
}



//DELETE BOOK
/*
Function that deletes (not really delete, just deactivastes) and returns the deactivated BOOK (as a JSON object)

IMPLEMENTED WITH delete

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_book_to_deactivate (this is mandatory)
*/
bookController.deleteBook = (req,res) => {

  console.log('DELETE BOOK REQ');

  var bookId = req.params.id;
  var update = {status: 'INACTIVE'};

  Book.findByIdAndUpdate(bookId, update, (err, bookUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al eliminar libro'});

    } else {
      if (!bookUpdated) {
        res.status(404).send({message: 'No se ha podido eliminar al cliente'});

      } else {

        Book.findOne({_id: bookId}, (err, delBook) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});

          } else {
            if (!delBook) {
              res.status(404).send({message: 'EL LIBRO NO EXISTE'});

            } else {
              res.status(200).send(delBook);
            }
          }
        });
      }
    }
  });
}


//UPLOAD BOOK IMAGE
/*
Function that uploads an image to a book and returns the book (as a JSON object)

IMPLEMENTED WITH post

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_book (this is mandatory)

in the body send the image in format ... (investigar)
*/
bookController.uploadImage = (req, res) => {
  var bookId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[3];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Book.findByIdAndUpdate(bookId, {image: file_name}, (err, bookUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar imagen del libro'});

        } else {
          if (!bookUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar la imagen del libro'});

          } else {
            res.status(200).send({image: file_name, book: bookUpdated});
          }
        }
      });

    } else {
      res.status(200).send({message: 'Extensión no valida'});
    }

  } else {
    res.status(200).send({message: 'No se ha subido ninguna imagen'});
  }
}



//GET BOOKS IMAGE
/*
Function that returns a book image file

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: imageFile (this is mandatory, is the name of the image in the book image: attribute)
*/
bookController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/books/images/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}


//UPLOAD BOOK FILE
/*
Function that uploads a file to a book and returns the book (as a JSON object)

IMPLEMENTED WITH post

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_book (this is mandatory)
*/
bookController.uploadBookFile = (req, res) => {

  var bookId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('/');
    var file_name = file_split[3];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'pdf' || file_ext == 'mp3') {
      Book.findByIdAndUpdate(bookId, {file: file_name}, (err, bookUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar LIBRO'});

        } else {
          if (!bookUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el libro'});

          } else {
            res.status(200).send({book: bookUpdated});
          }
        }
      });

    } else {
      res.status(200).send({message: 'Extensión no valida'});
    }

  } else {
    res.status(200).send({message: 'No se ha subido ningun file'});
  }
}

//GET BOOKS FILE

/*
Function that returns a book file

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: imageFile (this is mandatory, is the name of the file in the book file: attribute)
*/
bookController.getBookFile = (req, res) => {
  var bookFile = req.params.bookFile;
  var path_file = './uploads/books/files/' + bookFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe el libro'});
    }
  });
}















/*HASTA AQUÍ LLEGA*/

//**********************  GET REGISTERS *************************
//GET CREATED BOOK(S) REGISTERS
/*
Function that returns the register of the created book or books, returns the list of the creation of books with its info

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_book (this is not mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
bookController.readCreationsBook = (req, res) => {

  var bookId = req.params.id;

  if (!bookId) {
    var find = CBook.find({}).sort('date');
  } else {
    var find = CBook.find({book: bookId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, book_creations) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_creations) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_creations});
      }
    }
  });
}

//GET CREATED BOOS BY EMPLOYEE
/*
Function that returns the register of the created book or books by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
bookController.readCreationsBooksByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = CBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = CBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, book_creations) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_creations) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_creations});
      }
    }
  });
}


//GET DELETED BOOK REGISTER(S)
/*
Function that returns the updates over a book

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_book (this is not mandatory and is used to get the book's updates info, if not exist, then return all registers)
*/
bookController.readUpdatesBook = (req, res) => {

  var bookId = req.params.id;

  if (!bookId) { //Sacar todos las rentas de BD
    var find = UBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = UBook.find({book: bookId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, book_updates) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_updates) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_updates});
      }
    }
  });
}



//GET updated BOOKS BY EMPLOYEE
/*
Function that returns the register of the updated book or books by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the book's creation info, if not exist, then return all registers)
*/
bookController.readUpdatesBookByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = UBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = UBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, book_updates) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_updates) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_updates});
      }
    }
  });
}


//GET DELETED BOOK REGISTER(S)
/*
Function that returns the deletion(s) of a book

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_book (this is not mandatory and is used to get the author's deletion info, if not exist, then return all registers)
*/
bookController.readDeletionsBook = (req, res) => {

  var bookId = req.params.id;

  if (!bookId) { //Sacar todos las rentas de BD
    var find = DBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = DBook.find({book: bookId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, book_deletions) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_deletions) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_deletions});
      }
    }
  });
}


//GET DELETED BOOKS BY EMPLOYEE
/*
Function that returns the register of the updated book or books by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
bookController.readDeletesBookByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = DBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = DBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, book_deletes) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!book_deletes) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({book_deletes});
      }
    }
  });
}

module.exports = bookController;
