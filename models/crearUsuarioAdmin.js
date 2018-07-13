var mongoose = require('mongoose');
var User = require('../models/user');
//var Company = require('../models/company');
// en caso de ejecutar este archivo desde Node por fuera del proyecto, descomentar las lineas de conexion y desconexion a mongo.
//mongoose.connect('localhost:27017/Aquosa');


var nombre = "administrador";
var apellido = "administrador";
var email = "admin@admin.com";
var password = "admin++";
var esAdmin = true;


var data = {
  nombre,
  apellido,
  email,
  password,
  esAdmin
};

var userAdmin = new User(data);
//var compania = new Company({
//  nombre_fantasia: 'nombrefantasia',
//  quienes_somos: 'somo lo que somo',
//  que_hacemos: 'cantamos cumbia',
//  direccion: 'los pasillos de la villa',
//  email: 'pablitolescano@gmail.com',
//  telefono: [{ fijo: '123456789', movil: '123456789' }],
//  redes_sociales: [{ facebook: 'elpabliin', youtube: 'damasgratisoficial' }],
//  caracteristicas_negocio: [{
//    caracteristica_1: 'String1',
//    caracteristica_2: 'String2',
//    caracteristica_3: 'String3'
//  }],
//  descripcion_producto_servicio: [{producto_servicio_1: 'String',
//  descripcion_1: 'String',
//  producto_servicio_2: 'String',
//  descripcion_2: 'String',
//  producto_servicio_3: 'String',
//  descripcion_3: 'String'}],
//  catalogo_imagenes: [{
//    imagen_principal: '1234-1531322733557.png',
//    imagen_1: 'Slide1.png',
//    imagen_2: 'Slide1.png',
//    imagen_3: 'Slide1.png',
//    imagen_4: 'Slide1.png',
//    imagen_5: 'Slide1.png',
//    imagen_6: 'Slide1.png'
//  }],
//  productos: [],
//  active: true,
//  url_key: 'url',
//  productos: []
//})
//compania.save();
User.findOne({email: email, password: password}, function(err,users){
  if(err){
    console.log(err);
  }
  if(!users) {
    userAdmin.save(function(err){
      if (err) {console.log(err)}
      else {
        console.log(userAdmin);
        console.log("usuario admin creado con exito!");
        //mongoose.disconnect();
       };
    });
  }
  if(users) {
    console.log(users)
    console.log("usuario admin ya existe!");
    //mongoose.disconnect();
  }
});
