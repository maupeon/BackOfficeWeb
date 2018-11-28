//ADMIN USER
'use strict'

exports.ensureAdmin = function(req, res, next){
  if (!req.headers.role) {
    return res.status(403).send({message: 'La petición no tiene la cabecera de role'});

  }

  var role = req.headers.role;

  try {
    if (role != 'USER_ADMIN') {
      return res.status(401).send({message: 'ROL NO IDENTIFICADO'});
    }
  } catch (e) {
    //console.log(ex);
    return res.status(404).send({message: 'ROL NO VÁLIDO'});

  }

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({message: 'EL TOKEN HA EXPIRADO'});
    }
  } catch(ex) {
    //console.log(ex);
    return res.status(404).send({message: 'EL TOKEN NO ES VÁLIDO'});
  }

  req.user = payload;

  next();
};
