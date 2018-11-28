//MODELO RENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RentSchema = Schema({
  date_init: Date,
  date_end: Date,
  status: String,
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  },
  book: {
    type: Schema.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('Rent', RentSchema);
