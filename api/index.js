//INDEX
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/proyecto_web', (err, res) => {
  if (err)
    throw err;
  else {
    console.log('La conexion a la base de datos está corriendo correctamente');
    app.listen(port, () => {
      console.log('Servidor del API rest escuchando en http://localhost:' + port);
    }

    );
  }
});
