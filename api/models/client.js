  //MODELO CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = Schema({
  name: String,
  surname: String,
  email: String,
  username: String,
  password: String,
  image: String,
  role: String,
  status: String,
  balance: Number
});

module.exports = mongoose.model('Client', ClientSchema);
