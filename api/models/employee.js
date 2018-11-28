//MODELO EMPLOYEE
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = Schema({
  name: String,
  surname: String,
  email: String,
  username: String,
  password: String,
  image: String,
  role: String,
  status: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
