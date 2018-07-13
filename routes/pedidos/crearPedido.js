var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Pedido = require('../../models/pedido');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    var datos = JSON.stringify(req.session.user);
    var totalPrice = req.session.user.carrito.totalPrice;

    var productos = []
    for (var item in req.session.user.carrito.items) {
        if (!req.session.user.carrito.items.hasOwnProperty(item)) continue;
        var obj = req.session.user.carrito.items[item];
        productos.push(obj);
    };

    res.render('pedidos/crear', { usuario:req.session.user, datos: datos, productos: productos, totalPrice:totalPrice });

    //Pedido.findById(pedidoId, function(err, pedido){});
  }else{
    res.redirect("/")
  }
});

/* GET home page. */
router.post('/', function(req, res, next) {
  if(req.session && req.session.user){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    /* validaciones del registro */
    req.check('direccion', 'Ingrese una direccion!').notEmpty();
    req.check('tipoPago', 'Ingrese un tipo de pago!').notEmpty();
    req.check('tipoEntrega', 'Ingrese un tipo de entrega!').notEmpty()
    var listaErrores = req.validationErrors();
    if (listaErrores) {
      var mensajes = [];
      listaErrores.forEach(function(error){
          mensajes.push(error.msg);
      });
      var datos = JSON.stringify(req.session.user);
      var totalPrice = req.session.user.carrito.totalPrice;

      var productos = []
      for (var item in req.session.user.carrito.items) {
          if (!req.session.user.carrito.items.hasOwnProperty(item)) continue;
          var obj = req.session.user.carrito.items[item];
          productos.push(obj);
      };

      return res.render('pedidos/crear', { usuario:req.session.user, datos: datos, productos: productos, errores: mensajes, totalPrice:totalPrice });
    };

    var d = new Date();
    var fechaHora = "";
    var d = new Date();
    var DD =  d.getDate();
    var MM =  d.getMonth() + 1;
    var YY =  d.getFullYear();

    fechaHora = "" + MM + "-" + DD + "-" +  YY;

    var carrito = req.session.user.carrito;
    var userID = req.session.user._id;
    var direccion = req.body.direccion;
    var tipoPago = req.body.tipoPago;
    var tipoEntrega = req.body.tipoEntrega;
    var pagado =  false;
    var entregado =  false;
    var fechaPedido = fechaHora;
    var fechaEntrega =  null;
    var factura = null;

    var data = {
      carrito,
      userID,
      direccion,
      tipoPago,
      tipoEntrega,
      pagado,
      entregado,
      fechaPedido,
      fechaEntrega,
      factura
    };

    var pedido = new Pedido(data);
    pedido.save(function(err){
      if (err) {
        res.render('pedidos/crear', {
          usuario: req.session.user,
          error: "<div class='alert alert-danger' role='alert'>No se pudo cargar el pedido, falló la conexion a la base de datos.</div>",
          datos: datos,
          productos: productos,
          totalPrice:totalPrice
        });
      }
      else {
        req.session.user.carrito = [];
        res.redirect('/index');
      };
    });

  }else{
    res.redirect("/")
  }
});

module.exports = router;
