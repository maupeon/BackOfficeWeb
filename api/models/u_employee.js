//MODELO U_EMPLOYEE
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UEmployeeSchema = Schema({
  date: Date,
  before: Object,
  after: Object,
  mannager:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  }
});

module.exports = mongoose.model('UEmployee', UEmployeeSchema);
