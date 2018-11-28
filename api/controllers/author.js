//CONTROLADOR AUTHOR
'use strict'
var fs = require('fs');
var path = require('path');
var Author = require('../models/author');

//CRUD
var CAuthor = require('../models/c_author');
var UAuthor = require('../models/u_author');
var DAuthor = require('../models/d_author');
var jwt = require('../services/jwt');

var authorController = {};



//CREATE A NEW AUTHOR
/*
Function used to create an author
This function returns the created author (as a JSON OBJECT)

IMPLEMENTED WITH post
in header send the next params
  Autorization: token_of_the_admin
  role: ROLE_ADMIN (It is stored in the client or employee atributes as role: )

in the request parameters send the next atributes in the express url
  admin: id_of_the_admin (this is mandatory)
*/
authorController.createAuthor = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN' && req.headers.role != 'ROLE_EMPLOYEE') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {

        var author = new Author();
        var params = req.body;
        var employeeId = req.params.admin;

        author.name = params.name;
        author.surname = params.surname;
        author.description = params.description;
        author.image = 'null';
        author.status = 'ACTIVE';

        if (author.name != null && author.surname != null && author.description != null) {
          //Guarar autor en BD
          author.save((err, authorStored) => {

            if (err) {
              res.status(500).send({message: 'ERROR AL GUARDAR AUTOR'});

            } else {
              if (!authorStored) {
                res.status(404).send({message: 'NO SE HA GUARDADO AL AUTOR'});

              } else {
                var c_author = new CAuthor();
                c_author.date = new Date();
                c_author.employee = employeeId;
                c_author.author = authorStored._id;

                //Guarar registro de autor creado en BD
                c_author.save((err, cauthorStored) => {
                  if (err) {
                    res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR CREADO'});

                  } else {
                    if (!cauthorStored) {
                      res.status(404).send({message: 'NO SE HA REGISTRADO LA CREACION DEL AUTOR'});

                    } else {
                      res.status(200).send({author: authorStored});
                    }
                  }
                });
              }
            }
          });

        } else {
          res.status(200).send({message: 'Introduce todos los campos para crear un nuevo autor'});
        }
    }
  }
}



//READ AUTHOR
/*
Function that returns an AUTHOR (as a JSON object) with a given id of the AUTHOR

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory) //ALL USERS (ADMIN, EMPLOYEE & CLIENTS) CAN GET AN AUTHOR.

in the request parameters send the next atributes in the express url
  id: id (this is mandatory) -> id of the author
*/
authorController.readAuthor = (req, res) => {

  var authorId = req.params.id;

  Author.findById(authorId, (err, author) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION GET AUTHOR'});
    } else {
      if (!author) {
        res.status(404).send({message: 'EL AUTOR NO EXISTE'});
      } else {
        res.status(200).send({author: author});
      }
    }
  });
}



//READ AUTHORS
/*
Function that returns the number and a lsit of active authors, stored in pages (as a JSON object)

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory) //ALL USERS (ADMIN, EMPLOYEE & CLIENTS) CAN GET AN AUTHOR.

in the request parameters send the next atributes in the express url
  page: number of the page (this is not mandatory)
*/
authorController.readAuthors = (req, res) => {

  console.log('AUTHORS REQ');

  Author.find({status: 'ACTIVE'}).sort('name').exec(function(err, authors){
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (authors) {
        res.json(authors);
      } else {
        res.status(404).send({message: 'NO HAY AUTORES'});
      }
    }
  });
}



//UPDATE CLIENT
/*
Function that updates and returns the updated author (as a JSON object)

IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_author_to_update (this is mandatory)
  admin: id_of_admin (this is mandatory)
*/
authorController.updateAuthor = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN' && req.headers.role != 'ROLE_EMPLOYEE') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var authorId = req.params.id;
      var employeeId = req.params.admin;
      var update = req.body;

      Author.findByIdAndUpdate(authorId, update, (err, authorUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar autor'});

        } else {
          if (!authorUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al autor'});

          } else {
            var u_author = new UAuthor();
            u_author.date = new Date();
            u_author.before = authorUpdated;
            u_author.employee = employeeId;
            u_author.author = authorUpdated._id;

            Author.findOne({_id: authorId}, (err, upAuthor) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upAuthor) {
                  res.status(404).send({message: 'EL AUTOR NO EXISTE'});

                } else {
                  u_author.after = upAuthor;

                  //Guarar registro de autor modificado en BD
                  u_author.save((err, uauthorStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR ACTUALIZADO'});

                    } else {
                      if (!uauthorStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTUALIZACION DEL AUTOR'});

                      } else {
                        res.status(200).send({upAuthor});
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
}



//DELETE AUTHOR
/*
Function that deletes (not really delete, just deactivastes) and returns the deactivated AUTHOR (as a JSON object)

IMPLEMENTED WITH delete

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_author_to_deactivate (this is mandatory)
  admin: id_of_admin (this is mandatory)
*/
authorController.deleteAuthor = (req,res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var employeeId = req.params.admin;
      var authorId = req.params.id;
      var update = {status: 'INACTIVE'};

      Author.findByIdAndUpdate(authorId, update, (err, authorUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar cliente'});

        } else {
          if (!authorUpdated) {
            res.status(404).send({message: 'No se ha podido inactivar al autor'});

          } else {
            var d_author = new DAuthor();
            d_author.date = new Date();
            d_author.employee = employeeId;

            Author.findOne({_id: authorId}, (err, upAuthor) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upAuthor) {
                  res.status(404).send({message: 'EL AUTOR NO EXISTE'});

                } else {
                  d_author.author = upAuthor;

                  //Guarar registro de autor inhabilitado en BD
                  d_author.save((err, dauthorStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR INACTIVO'});

                    } else {
                      if (!dauthorStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO AL AUTOR DESACTIVADO'});

                      } else {
                        res.status(200).send({upAuthor});
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
}


//UPLOAD AUTHORS IMAGE
/*
Function that uploads an image to an author and returns the author (as a JSON object)

IMPLEMENTED WITH post

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN or ROLE_EMPLOYEE (this is mandatory) -> Just ADMIN and EMPLOYEE CAN UPDATE AUTHORS IMAGE

in the request parameters send the next atributes in the express url
  id: id_of_author (this is mandatory)
*/
authorController.uploadImage = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN' && req.headers.role != 'ROLE_EMPLOYEE') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var authorId = req.params.id;
      var file_name = 'null';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
          Author.findByIdAndUpdate(authorId, {image: file_name}, (err, authorUpdated) => {
            if (err) {
              res.status(500).send({message: 'Error al actualizar cliente'});

            } else {
              if (!authorUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar la imagen del autor'});

              } else {
                res.status(200).send({image: file_name, author: authorUpdated});
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
  }
}



//GET AUTHOR'S IMAGE
/*
Function that returns an authors image file

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: imageFile (this is mandatory, is the name of the image in the author image: attribute)
*/
authorController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/authors/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}


//**********************  GET REGISTERS *************************
//GET CREATED AUTHOR REGISTERS
/*
Function that returns the register of the created author or authors, returns the list of the creation of authors with its info

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_author (this is not mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
authorController.readCreationsAuthor = (req, res) => {

  var authorId = req.params.id;

  if (!authorId) { //Sacar todos las rentas de BD
    var find = CAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = CAuthor.find({author: authorId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_creations) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_creations) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_creations});
      }
    }
  });
}

//GET CREATED AUTHORS BY EMPLOYEE
/*
Function that returns the register of the created author or authors by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
authorController.readCreationsAuthorByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = CAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = CAuthor.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_creations) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_creations) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_creations});
      }
    }
  });
}


//GET DELETED AUTHOR REGISTER(S)
/*
Function that returns the updates over an author

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_author (this is not mandatory and is used to get the authors's updates info, if not exist, then return all registers)
*/
authorController.readUpdatesAuthor = (req, res) => {

  var authorId = req.params.id;

  if (!authorId) { //Sacar todos las rentas de BD
    var find = UAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = UAuthor.find({author: authorId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_updates) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_updates) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_updates});
      }
    }
  });
}



//GET updated AUTHORS BY EMPLOYEE
/*
Function that returns the register of the updated author or authors by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
authorController.readUpdatesAuthorByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = UAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = UAuthor.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_updates) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_updates) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_updates});
      }
    }
  });
}


//GET DELETED AUTHOR REGISTER(S)
/*
Function that returns the deletion(s) of an author

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  id: id_of_the_author (this is not mandatory and is used to get the author's deletion info, if not exist, then return all registers)
*/
authorController.readDeletionsAuthor = (req, res) => {

  var authorId = req.params.id;

  if (!authorId) { //Sacar todos las rentas de BD
    var find = DAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = DAuthor.find({author: authorId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_deletions) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_deletions) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_deletions});
      }
    }
  });
}


//GET DELETED AUTHORS BY EMPLOYEE
/*
Function that returns the register of the updated author or authors by employee

IMPLEMENTED WITH get

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  employee: id_of_the_employee (this is mandatory and is used to get the author's creation info, if not exist, then return all registers)
*/
authorController.readDeletesAuthorByEmployee = (req, res) => {

  var employeeId = req.params.employee;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = DAuthor.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = DAuthor.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'author'}]).exec((err, author_deletes) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!author_deletes) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({author_deletes});
      }
    }
  });
}

module.exports = authorController
