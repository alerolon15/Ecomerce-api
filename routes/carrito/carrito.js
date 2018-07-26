const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Producto = require('../../models/producto');
const Carrito = require('../../models/carrito');
const Company = require('../../models/company');

exports.get = function(req, res, next) {
  if(req.session && req.session.user){
    let urlkey = req.params.urlkey;
    let productoId = req.params.id;
    Company.find({url_key:urlkey},function(err,compania){
      var inicialN = req.session.user.nombre.substring(0,1);
      var inicialA = req.session.user.apellido.substring(0,1);
      var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
      req.session.user.iniciales = iniciales;

      if (!req.session.user.carrito) {
        return res.render('carrito/carrito', {usuario: req.session.user, products: null, compania:compania});
      }
      var carrito = new Carrito(req.session.user.carrito);
      res.render('carrito/carrito', {usuario: req.session.user, products: carrito.generateArray(), totalPrice: carrito.totalPrice, compania:compania});
    });
  }else{
    res.redirect("/")
  };
};

exports.reduce =  function(req, res, next) {
    var productId = req.params.id;
    var carrito = new Carrito(req.session.user.carrito ? req.session.user.carrito : {});

    carrito.reduceByOne(productId);
    req.session.user.carrito = carrito;
    res.redirect('/empresas/' + req.params.urlkey + '/carrito');
};

exports.remove = function(req, res, next) {
    var productId = req.params.id;
    var carrito = new Carrito(req.session.user.carrito ? req.session.user.carrito : {});

    carrito.removeItem(productId);
    req.session.user.carrito = carrito;
    res.redirect('/empresas/' + req.params.urlkey + '/carrito');
};
