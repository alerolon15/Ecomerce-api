var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Producto = require('../../models/producto');

/* GET home page. */
router.get('/:id', function(req, res, next) {
  if(req.session && req.session.user){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;
    var productoId = req.params.id;
    console.log(req.params.urlkey)
    Producto.findById(productoId, function(err, producto){
      res.render('productos/info', { usuario: req.session.user, producto: producto});
    });
  }else{
    //res.redirect("/")

    var productoId = req.params.id;
    console.log(req.params.urlkey)
    Producto.findById(productoId, function(err, producto){
      res.render('productos/info', { producto: producto});
    });
  }
});

module.exports = router;
