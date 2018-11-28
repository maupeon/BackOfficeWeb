//MODELO U_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UBookSchema = Schema({
  date: Date,
  before: Object,
  after: Object,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  book:{
    type: Schema.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('UBook', UBookSchema);
