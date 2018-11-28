//MODELO U_AUTHOR
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UAuthorSchema = Schema({
  date: Date,
  before: Object,
  after: Object,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  author:{
    type: Schema.ObjectId,
    ref: 'Author'
  }
});

module.exports = mongoose.model('UAuthor', UAuthorSchema);
