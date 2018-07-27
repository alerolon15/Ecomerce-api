var mongoose = require('mongoose');
var User = require('../models/user');
//var Company = require('../models/company');
// en caso de ejecutar este archivo desde Node por fuera del proyecto, descomentar las lineas de conexion y desconexion a mongo.
//mongoose.connect('localhost:27017/Aquosa');


var nombre = "administrador";
var apellido = "administrador";
var email = "admin@admin.com";
var password = "admin++";
var iniciales = setIniciales(nombre,apellido);
console.log(iniciales);
var esAdmin = true;
var esOwner = true;

var data = {
  nombre,
  apellido,
  email,
  password,
  iniciales,
  esAdmin,
  esOwner
};

var userAdmin = new User(data);

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
