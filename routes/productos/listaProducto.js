var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Producto = require('../../models/producto');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    Producto.find({}, function(err, productos){
      //console.log(productos);
      res.render('productos/lista', { usuario: req.session.user, productos: productos});
    });
  }else{
    res.redirect("/index")
  }
});

router.get('/borrar/:id', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    var productoBorrar = req.params.id;
    Producto.findByIdAndRemove(productoBorrar, function(err, producto){
      if(err) {
        console.log(err);
      };
      res.redirect('/listaProducto');
    });
  }else{
    res.redirect("/index")
  }
});

router.get('/editar/:id', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    var productoEditar = req.params.id;
    Producto.findById(productoEditar, function(err, producto){
      if(err) {
        console.log(err);
      };
      res.render('productos/editar', { usuario: req.session.user, producto: producto});
    });
  }else{
    res.redirect("/index")
  }
});

router.post('/editar/:id', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    var productoId = req.params.id;

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
      Producto.findById(productoId, function(err, prod){

        var options = {
          title: 'Aquosa',
          errores: mensajes,
          bgClass:'bg-dark',
          producto: prod
        }

        res.render('productos/editar',options);
        });
    }else{

      var codigo = req.body.codigo;
      var titulo = req.body.titulo;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var cantidad = req.body.cantidad.toUpperCase();
      var categoria = req.body.categoria.toUpperCase();

      var data = {
        codigo,
        titulo,
        descripcion,
        precio,
        cantidad,
        categoria
      };

      var producto = new Producto(data);
      Producto.findByIdAndUpdate(productoId, data, function(err){
        if (err) {
          Producto.find({}, function(err, productos){
            res.render('productos/lista', {
              usuario: req.session.user,
              productos: productos,
              error: "<div class='alert alert-danger' role='alert'>no se ha podido modificar correctamente el producto.</div>"
             });
          });
        } else {
          Producto.find({}, function(err, productos){
            res.render('productos/lista', {
              usuario: req.session.user,
              productos: productos,
              error: "<div class='alert alert-success' role='alert'>Se ha modificado correctamente el producto.</div>"
             });
          });
        };
      });
    };
  }else{
    res.redirect('/index');
  };
});


module.exports = router;
