var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Pedido = require('../../models/pedido');


/* GET home page. */
router.get('/:id', function(req, res, next) {
  if(req.session && req.session.user){
    var inicialN = req.session.user.nombre.substring(0,1);
    var inicialA = req.session.user.apellido.substring(0,1);
    var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
    req.session.user.iniciales = iniciales;

    var pedidoId = req.params.id;

    Pedido.findById(pedidoId, function(err, pedido){
      if(err) {
        res.status(404);
      };
      if (pedido) {
        User.findById(pedido.userID, function(err, usuario){
          //console.log(pedido);
          var result = { usuario:usuario, pedido: pedido };
          //console.log(result)

          res.send(result);
        });
      }else{
        res.status(404);
      }
    });
  }else{
    res.redirect("/")
  }
});

module.exports = router;
