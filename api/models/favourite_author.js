//MODELO FAVOURITE_AUTHOR
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavouriteAuthorSchema = Schema({
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  },
  author:{
    type: Schema.ObjectId,
    ref: 'Author'
  }
});

module.exports = mongoose.model('FavouriteAuthor', FavouriteAuthorSchema);
