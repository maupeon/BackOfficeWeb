//CONTROLADOR EMPLOYEE
'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Employee = require('../models/employee');

//CRUD
var CEmployee = require('../models/c_employee');
var UEmployee = require('../models/u_employee');
var DEmployee = require('../models/d_employee');
var jwt = require('../services/jwt');

var employeeController = {};


//CREATE A NEW EMPLOYEE
/*
Function used to create an employee (normal employee).
This function returns the created employee (as a JSON OBJECT)

IMPLEMENTED WITH post

in header send the next params
  Autorization: token_of_the_user

in the request parameters send the next atributes in the express url
  NO PARAMS IN URL

in the body send the next params
  name:
  surname:
  email:
  username:
  password:
*/
employeeController.createEmployee = (req, res) => {

  console.log('CLIENT CREATION REQ');
  var employee = new Employee();
  var params = req.body;

  employee.name = params.name;
  employee.surname = params.surname;
  employee.email = params.email.toLowerCase();
  employee.username = params.username;
  employee.role = 'ROLE_EMPLOYEE';
  employee.image = 'null';
  employee.status = 'ACTIVE_EMPLOYEE';

  if (params.password) {
    //Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, function(err, hash){
      employee.password = hash;
      if (employee.name != null && employee.surname != null && employee.email != null) {

        //Guarar usuario en BD
        employee.save((err, employeeStored) => {
          if (err) {
            res.send({message: 'ERROR AL GUARDAR EMPLEADO'});

          }  else {
            if (!employeeStored) {
              res.send({message: 'NO SE HA REGISTRADO AL EMPLEADO'});

            } else {
              res.send(employeeStored);
            }
          }
        });
      }
      else {
        res.send({message: 'Introduce todos los campos'});
      }
    });
  }
  else{
    res.send({message: 'Introduce la contraseña'});
  }
}



//LOGIN AS AN EMPLOYEE
/*
Function used to login as an employee (ADMIN or normal employee).
This function returns a token if the login was correct and the logged employee JSON object

IMPLEMENTED WITH post

in header send the next params
  NO PARAMS IN HEADER

in the request parameters send the next atributes in the express url
  NO PARAMS IN URL

in the request body send the next atributes
  email: email_of_the_user (this is mandatory)
  password: password_of_the_user (this is mandatory)
  gethash: true (this is mandatory and with this you reciebe the token, if not, just reciebe employee)
*/
employeeController.loginEmployee = (req, res) => {

  console.log('LOGIN EMPLOYEE REQUEST');

  var params = req.body;
  var email = params.email;
  var password = params.password;

  Employee.findOne({email: email.toLowerCase()}, (err, employee) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!employee) {
        res.status(404).send({message: 'EL EMPLEADO NO EXISTE'});

      } else {

        if (employee.status != 'ACTIVE_ADMIN' && employee.status != 'ACTIVE_EMPLOYEE') {
          res.status(404).send({message: 'EL USUARIO NO EXISTE'})
        } else {
          //Comprobar contraseña
          bcrypt.compare(password, employee.password, (err, check) => {
            if (check) {
              //Devolver los datos del usuario logeado
              if (params.gethash) { //Generar token con objeto del usuario
                  //devolver token de jwt
                  console.log(employee);
                  res.status(200).send({
                    employee: employee,
                    token: jwt.createToken(employee)
                  });
              }
              else {
                res.status(200).send(JSON.stringify({employee}));
              }
            }
            else {
              res.status(404).send({message: 'EL EMPLEADO NO HA PODIDO LOGUEARSE'});
            }
          });
        }
      }
    }
  });
}



//READ EMPLOYEE
/*
Function that returns an employee (as a JSON object) with a given id of the employee

IMPLEMENTED WITH get

in header send the next params
NONE

in the request parameters send the next atributes in the express url
  id: employee_id (this is mandatory)

*/
employeeController.readEmployee = (req, res) => {

  var employeeId = req.params.id;

  Employee.findById(employeeId, (err, employee) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!employee) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});

      } else {
        res.send(employee);
      }
    }
  });
}


//READ EMPLOYEES
/*
Function that returns the number and a lsit of active employees in a page (as a JSON object)

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)
*/
employeeController.readEmployees = (req, res) => {
  console.log('EMPLOYEES REQ');

  Employee.find({status: 'ACTIVE_EMPLOYEE'}).sort('name').exec(function(err, employees){
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (employees) {
        res.json(employees);
        //res.status(404).send({message: 'HOLI'});

      } else {
        res.status(404).send({message: 'NO HAY EMPLEADOS'});
      }
    }
  });
}



//UPDATE EMPLOYEE
/*
Function that updates and returns the updated employee (as a JSON object)

IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_employee_to_update (this is mandatory)
*/
employeeController.updateEmployee = (req, res) => {

  console.log('UPDATE REQUEST');

  var employeeId = req.params.id;
  var update = req.body;
  console.log(req.body);

  Employee.findByIdAndUpdate(employeeId, update, (err, employeeUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar empleado'});

    } else {
      if (!employeeUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al empleado'});
      } else {
        res.status(200).send(employeeUpdated);
      }
    }
  });
}



//DELETE EMPLOYEE
/*
Function that deletes (not really delete, just deactivastes) and returns the deactivated employee (as a JSON object)

IMPLEMENTED WITH delete

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_employee_to_deactivate (this is mandatory)
*/
employeeController.deleteEmployee = (req,res) => {

  console.log('DELETE EMPLOYEE REQ');
  var employeeId = req.params.id;
  var update = {status: 'INACTIVE_EMPLOYEE'};

  Employee.findByIdAndUpdate(employeeId, update, (err, employeeIdUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al eliminar empleado'});

    } else {
      if (!employeeIdUpdated) {
        res.status(404).send({message: 'No se ha podido eliminar al cliente'});

      } else {
        res.send({employeeIdUpdated});
      }
    }
  });
}


//UPLOAD EMPLOYEE IMAGE
/*
Function that uploads an image to an employee and returns the employee (as a JSON object)

IMPLEMENTED WITH post

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_employee (this is mandatory)
*/
employeeController.uploadImage = (req, res) => {

  var employeeId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Employee.findByIdAndUpdate(employeeId, {image: file_name}, (err, employeeUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al subir imagen del empleado'});

        } else {
          if (!employeeUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al empleado'});

          } else {
            res.status(200).send({image: file_name, employee: employeeUpdated});
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



//GET EMPLOYEE IMAGE
/*
Function that returns an employee image file

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: imageFile (this is mandatory, is the name of the image in the users image: attribute)
*/
employeeController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/employees/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));

    } else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}



/*CRATE ADMIN WITH POSTMAN*/
/*SEND password: in body parameters*/
employeeController.createAdmin = (req, res) => {

  var employee = new Employee();
  var params = req.body;

  employee.name = "Admin";
  employee.surname = "Admin";
  employee.email = "admin@admin.com"
  employee.username = "Admin";
  employee.role = 'ROLE_ADMIN';
  employee.image = 'null';
  employee.status = 'ACTIVE_ADMIN';

  if (!params.password) {
    bcrypt.hash("password1", null, null, function(err, hash){
      employee.password = hash;
      employee.save((err, adminStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR EMPLEADO'});
        }  else {
          if (!adminStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO AL EMPLEADO'});
          } else {
            res.status(200).send({admin: adminStored});
          }
        }
      });
    });
  } else {
    bcrypt.hash(params.password, null, null, function(err, hash){
      employee.password = hash;
      employee.save((err, adminStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR EMPLEADO'});
        }  else {
          if (!adminStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO AL EMPLEADO'});
          } else {
            res.status(200).send({admin: adminStored});
          }
        }
      });
    });
  }
}


module.exports = employeeController
