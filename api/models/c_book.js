//MODELO C_BOOK
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CBookSchema = Schema({
  date: Date,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  book:{
    type: Schema.ObjectId,
    ref: 'Book'
  },
});

module.exports = mongoose.model('CBook', CBookSchema);
