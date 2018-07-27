const mongoose = require('mongoose');
const Company = require('../models/company');
// en caso de ejecutar este archivo desde Node por fuera del proyecto, descomentar las lineas de conexion y desconexion a mongo.
mongoose.connect('localhost:27017/Aquosa');


let data = {
  nombre_fantasia: 'Mistral Shoes',
  quienes_somos: 'compañia vestimenta',
  que_hacemos: 'Vendemos zapas',
  direccion: 'once',
  email: 'mistral@gmail.com',
  telefono: [{ fijo: '123456789', movil: '123456789' }],
  redes_sociales: [{ facebook: 'mistraloficial', youtube: 'mistralcanaloficial' }],
  caracteristicas_negocio: [{
    caracteristica_1: 'String1',
    caracteristica_2: 'String2',
    caracteristica_3: 'String3'
  }],
  descripcion_producto_servicio: [{producto_servicio_1: 'String',
  descripcion_1: 'String',
  producto_servicio_2: 'String',
  descripcion_2: 'String',
  producto_servicio_3: 'String',
  descripcion_3: 'String'}],
  catalogo_imagenes: [{
    imagen_principal: 'mistral-shoes-color.png',
    imagen_1: 'Slide1.png',
    imagen_2: 'Slide2.png',
    imagen_3: 'Slide3.png',
    imagen_4: 'Slide4.png',
    imagen_5: 'Slide5.png',
    imagen_6: 'Slide6.png'
  }],
  productos: [],
  active: true,
  url_key: 'mistralshoes',
  productos: []
};


var compania = new Company(data)

Company.findOne({nombre_fantasia: data.nombre_fantasia}, function(err,company){
  if(err){
    console.log(err);
  }
  if(!company) {
    compania.save(function(err){
      if (err) {console.log(err)}
      else {
        console.log(compania);
        console.log("La compañia ha sido creado con exito!");
        mongoose.disconnect();
       };
    });
  }
  if(company) {
    console.log(company)
    console.log("la compañia ya existe!");
    mongoose.disconnect();
  }
});


pe = require('parse-error'); //parse error para facilitar handling
to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [pe(err)]);
};

//throw error
TE = (err_message, log) => {
  if (log === true) {
    console.log(err_message);
  }

  throw new Error(err_message);
};

//Response Error
ReE = (res, err, code) => {
  //en caso de que el error sea un objecto que contiene un mensaje
  if (typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }
  //si existe un codigo
  if (typeof code !== 'undefined') {
    res.statusCode = code;
  }

  return res.json({ success: false, error: err });
};

//Response success
ReS = (res, data, code) => {
  let body = { success: true, data };

  //si existe un codigo
  if (typeof code !== 'undefined') {
    res.statusCode = code;
  }
  return res.json(body);
};

// handle todas la promesas que no fueron catcheadas

NSTR = str =>
  str
    .split(' ')
    .join('')
    .toLowerCase();
