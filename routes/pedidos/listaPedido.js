var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Pedido = require('../../models/pedido');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user && req.session.user.esAdmin){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    Pedido.find({}, function(err, pedidos){
      if (pedidos.length != 0) {
        pedidos.forEach(function(pedi){
          User.findById(pedi.userID, function(err, usuario){
            pedi.usuario = usuario;
          });
        });
      }else{
        pedidos: null;
      };
      res.render('pedidos/lista', { usuario: req.session.user, pedidos: pedidos});
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

    var pedidoBorrar = req.params.id;
    Pedido.findByIdAndRemove(pedidoBorrar, function(err, pedido){
      if(err) {
        console.log(err);
      };
      res.redirect('/listaPedido');
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

    var pedidoEditar = req.params.id;
    Pedido.findById(pedidoEditar, function(err, pedido){
      if(err) {
        console.log(err);
      };
      res.render('pedidos/editar', { usuario: req.session.user, pedido: pedido});
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

    var pedidoId = req.params.id;

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
      Pedido.findById(pedidoId, function(err, pedi){

        var options = {
          title: 'Aquosa',
          errores: mensajes,
          bgClass:'bg-dark',
          pedido: pedi
        }

        res.render('pedidos/editar',options);
        });
    }else{

      var codigo = req.body.codigo;
      var titulo = req.body.titulo;
      var descripcion = req.body.descripcion;
      var precio = req.body.precio;
      var cantidad = req.body.cantidad.toLowerCase();
      var categoria = req.body.categoria.toLowerCase();

      var data = {
        codigo,
        titulo,
        descripcion,
        precio,
        cantidad,
        categoria
      };

      var pedido = new Pedido(data);
      Pedido.findByIdAndUpdate(pedidoId, data, function(err){
        if (err) {
          Pedido.find({}, function(err, pedidos){
            res.render('pedidos/lista', {
              usuario: req.session.user,
              pedidos: pedidos,
              error: "<div class='alert alert-danger' role='alert'>no se ha podido modificar correctamente el pedido.</div>"
             });
          });
        } else {
          Pedido.find({}, function(err, pedidos){
            res.render('pedidos/lista', {
              usuario: req.session.user,
              pedidos: pedidos,
              error: "<div class='alert alert-success' role='alert'>Se ha modificado correctamente el pedido.</div>"
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
