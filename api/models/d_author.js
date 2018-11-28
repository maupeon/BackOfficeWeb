//MODELO D_AUTHOR
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DAuthorSchema = Schema({
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

module.exports = mongoose.model('DAuthor', DAuthorSchema);
