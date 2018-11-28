//MODELO BOOK_RATING
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookRatingSchema = Schema({
  rating: Number,
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  },
  book:{
    type: Schema.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('BookRating', BookRatingSchema);
