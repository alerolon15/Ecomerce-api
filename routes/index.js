var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Producto = require('../models/producto');
var Company = require('../models/company');


/* GET home page. */
router.get('/', function(req, res, next) {
  Company.find({}, function(err, company){
    if(req.session && req.session.user){
      var inicialN = req.session.user.nombre.substring(0,1);
      var inicialA = req.session.user.apellido.substring(0,1);
      var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
      req.session.user.iniciales = iniciales;

      res.render('index/index', { usuario: req.session.user, company: company});
    }else{
      res.render('index/index', { company: company});
    };
  });
});

router.get('/:urlkey', function(req, res, next) {
  let urlkey = req.params.urlkey;
  Company.find({url_key:urlkey},function(err,compania){
    if(compania.length > 0){
      let companiaid = compania[0]._id;
    Producto.find({companias:[companiaid]}, function(err, productos){
      let categorias = [];
      productos.forEach(function(prod){
          categorias.push(prod.categoria);
      });
      var categoriasV = [];
      categorias.forEach(function(cate) {
        if(categoriasV.indexOf(cate) === -1) {
          categoriasV.push(cate);
        }
      });
      if(req.session && req.session.user){
        var inicialN = req.session.user.nombre.substring(0,1);
        var inicialA = req.session.user.apellido.substring(0,1);
        var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
        req.session.user.iniciales = iniciales;
        res.render('index/commerce', { usuario: req.session.user, productos: productos, categorias: categoriasV, compania:compania});
      }else{
        res.render('index/commerce', { productos: productos,categorias: categoriasV, compania:compania});
      }
    });
  }else{
    res.redirect('/');
  }
  });
});


module.exports = router;
