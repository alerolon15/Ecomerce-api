var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Producto = require('../../models/producto');
var Carrito = require('../../models/carrito');

router.get('/', function(req, res, next) {
  if(req.session && req.session.user){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    if (!req.session.user.carrito) {
      return res.render('carrito/carrito', {usuario: req.session.user, products: null});
    }
    var carrito = new Carrito(req.session.user.carrito);
    res.render('carrito/carrito', {usuario: req.session.user, products: carrito.generateArray(), totalPrice: carrito.totalPrice});

  }else{
    res.redirect("/")
  };

});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var carrito = new Carrito(req.session.user.carrito ? req.session.user.carrito : {});

    carrito.reduceByOne(productId);
    req.session.user.carrito = carrito;
    res.redirect('/carrito');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var carrito = new Carrito(req.session.user.carrito ? req.session.user.carrito : {});

    carrito.removeItem(productId);
    req.session.user.carrito = carrito;
    res.redirect('/carrito');
});

module.exports = router;
