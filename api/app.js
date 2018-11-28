//APP
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

const port = 3977;

app.use(express.static('FrontOfficeFront'));

app.get('/', function(req, res){
    res.sendfile('FrontOfficeFront/login.html');
});



//Cargar rutas
var employee_routes = require('./routes/employee');
var client_routes = require('./routes/client');
var author_routes = require('./routes/author');
var book_routes = require('./routes/book');
var rent_routes = require('./routes/rent');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras http
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Allow', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

//Rutas base
app.use('/api', employee_routes);
app.use('/api', client_routes);
app.use('/api', author_routes);
app.use('/api', book_routes);
app.use('/api', rent_routes);

module.exports = app;
