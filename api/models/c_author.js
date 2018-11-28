//MODELO C_AUTHOR
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CAuthorSchema = Schema({
  date: Date,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  author:{
    type: Schema.ObjectId,
    ref: 'Author'
  }
});

module.exports = mongoose.model('CAuthor', CAuthorSchema);
