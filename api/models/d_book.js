//MODELO D_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DBookSchema = Schema({
  date: Date,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  book:{
    type: Schema.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('DBook', DBookSchema);
