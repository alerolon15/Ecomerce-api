var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');

var User = require('../../models/user');
var Producto = require('../../models/producto');

var rutaUpload = path.join(__dirname, '../../public/images/productos');

var nombres = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rutaUpload)
  },
  filename: function (req, file, cb) {
    var nombrearchivo = req.body.codigo + '-' + Date.now() + path.extname(file.originalname);
    nombres.push(nombrearchivo);
    cb(null, nombrearchivo);
  }
})

var upload = multer({
  storage: storage
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    res.render('productos/crear', { usuario: req.session.user, bgClass:'bg-dark'});
  }else{
    res.redirect('/index');
  };
});

router.post('/', upload.array('files', 8), function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    /* validaciones del registro */
    req.check('codigo', 'Ingrese un codigo!').notEmpty();
    req.check('titulo', 'Ingrese un titulo!').notEmpty();
    req.check('descripcion', 'Ingrese una descripcion!').notEmpty()
    req.check('precio', 'Ingrese un precio!').notEmpty()
    req.check('categoria', 'Ingrese una categoria!').notEmpty()
    req.check('cantidad', 'Ingrese una cantidad!').notEmpty()
    var listaErrores = req.validationErrors();
    if (listaErrores) {
      var mensajes = [];
      listaErrores.forEach(function(error){
          mensajes.push(error.msg);
      });
      var options = {
        title: 'Aquosa',
        errores: mensajes,
        bgClass:'bg-dark',
        datos: req.body
      };
      return res.render('productos/crear',options);
    };

    var codigo = req.body.codigo;
    var titulo = req.body.titulo;
    var descripcion = req.body.descripcion;
    var precio = req.body.precio;
    var categoria = req.body.categoria.toUpperCase();
    var cantidad = req.body.cantidad.toUpperCase();
    var imagenes = [];

    if(req.files){
      nombres.forEach(function(files){
          imagenes.push(files);
      });
      nombres = [];
    };
    if (imagenes.length < 1) {
      imagenes.push("default.jpg");
    };

    var data = {
      codigo,
      titulo,
      descripcion,
      precio,
      categoria,
      cantidad,
      imagenes
    };

    var producto = new Producto(data);
    producto.save(function(err){
      if (err) {
        res.render('productos/crear', {
          usuario: req.session.user,
          bgClass:'bg-dark',
          error: "<div class='alert alert-danger' role='alert'>No se pudo cargar el producto, falló la conexion a la base de datos.</div>",
          datos: req.body
        });
      }
      else {
        res.render('productos/crear', {
          usuario: req.session.user,
          bgClass:'bg-dark',
          error: "<div class='alert alert-success' role='alert'>Se ha creado correctamente el producto.</div>"
        });
      };
    });
  }else{
    res.redirect('/index');
  };
});

module.exports = router;
