//MODELO C_EMPLOYEE
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CEmployeeSchema = Schema({
  date: Date,
  mannager:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  }
});

module.exports = mongoose.model('CEmployee', CEmployeeSchema);
