//MODELO U_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UClientSchema = Schema({
  date: Date,
  before: Object,
  after: Object,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  }
});

module.exports = mongoose.model('UClient', UClientSchema);
