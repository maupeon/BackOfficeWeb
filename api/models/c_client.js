//MODELO C_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CClientSchema = Schema({
  date: Date,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  }
});

module.exports = mongoose.model('CClient', CClientSchema);
