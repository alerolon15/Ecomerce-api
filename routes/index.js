const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Producto = require('../models/producto');
const Company = require('../models/company');
const ProductosController = require('../controllers/ProductosController');
const ProductosRouters = require('./productos/crearProducto');

var path = require('path');
var multer = require('multer');

var rutaUpload = path.join(__dirname, '../public/images/productos');

var nombres = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rutaUpload)
  },
  filename: function (req, file, cb) {
    var nombrearchivo = req.body.codigo + '-' + Date.now() + path.extname(file.originalname);
    nombres.push(nombrearchivo);
    req.body.nombres = nombres;
    cb(null, nombrearchivo);
  }
})

var upload = multer({
  storage: storage
});


/* GET home page. */
router.get('/', function(req, res, next) {
  Company.find({}, function(err, company){
    if(req.session && req.session.user){
      let inicialN = req.session.user.nombre.substring(0,1);
      let inicialA = req.session.user.apellido.substring(0,1);
      let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
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
        let inicialN = req.session.user.nombre.substring(0,1);
        let inicialA = req.session.user.apellido.substring(0,1);
        let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
        req.session.user.iniciales = iniciales;
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

router.get('/:urlkey/listaProducto', ProductosController.listaGet);
router.get('/:urlkey/crearProducto', ProductosController.crearProducto);
router.post('/:urlkey/crearProducto', upload.array('files', 8), ProductosController.crearProductoPost);
router.get('/:urlkey/listaProducto/borrar/:id', ProductosController.borrarProducto);
router.get('/:urlkey/:id', ProductosController.get);

module.exports = router;
