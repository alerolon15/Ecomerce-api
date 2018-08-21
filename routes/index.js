const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Producto = require('../models/producto');
const Company = require('../models/company');
const path = require('path');
const multer = require('multer');
const carrito = require('./carrito/carrito');
const ProductosCrear = require('./productos/crearProducto');
const ProductosInfo = require('./productos/infoProducto');
const ProductosLista = require('./productos/listaProducto');

/* GET home page. */
router.get('/', function(req, res, next) {
  Company.find({}, function(err, company){
    if(req.session && req.session.user){
      res.render('index/index', { usuario: req.session.user, company: company});
    }else{
      res.render('index/index', {company: company});
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
          categoriasV.push({url:'/empresas/' + urlkey + '/categoria/' + cate, nombre:cate});
        }
      });
      if(req.session && req.session.user){
        res.render('index/commerce', { usuario: req.session.user, productos: productos, categorias: categoriasV, compania:compania});
      }else{
        res.render('index/commerce', { productos: productos,categorias: categoriasV, compania:compania});
      }
    });
    }else{
      res.redirect('/empresas');
    }
  });
});
router.get('/:urlkey/categoria/:categoria', function(req, res, next) {
  let urlkey = req.params.urlkey;
  let categoria = req.params.categoria;
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
          categoriasV.push({url:'/empresas/' + urlkey + '/categoria/' + cate, nombre:cate});
        }
      });
      //filtro los productos por categorias
      productos = productos.filter(function(item){
        return categoria.indexOf(item.categoria) > -1;
      });
      if(req.session && req.session.user){
        res.render('index/commerce', { usuario: req.session.user, productos: productos, categorias: categoriasV, compania:compania});
      }else{
        res.render('index/commerce', { productos: productos,categorias: categoriasV, compania:compania});
      }
    });
    }else{
      res.redirect('/empresas');
    }
  });
});

router.get('/:urlkey/carrito', carrito.get);
router.get('/:urlkey/carrito/reduce/:id', carrito.reduce);
router.get('/:urlkey/carrito/remove/:id', carrito.remove);

router.get('/:urlkey/listaProducto', ProductosLista.listaGet);
router.get('/:urlkey/listaProducto/borrar/:id', ProductosLista.borrarProducto);
router.get('/:urlkey/listaProducto/editar/:id', ProductosCrear.editarGet);
router.post('/:urlkey/listaProducto/editar/:id', ProductosLista.editarProducto);

router.get('/:urlkey/crearProducto', ProductosCrear.crearGet);
router.post('/:urlkey/crearProducto', ProductosCrear.uploadFiles,ProductosCrear.crearPost);

router.get('/:urlkey/:id', ProductosInfo.info);

module.exports = router;
