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

    Pedido.find({userID:req.session.user._id}, function(err, pedidos){
      if (pedidos.length != 0) {
        pedidos.forEach(function(pedi){
          User.findById(pedi.userID, function(err, usuario){
            pedi.usuario = usuario;
          });
        });
      }else{
        pedidos: null;
      };
      res.render('pedidos/miLista', { usuario: req.session.user, pedidos: pedidos});
    });
  }else{
    res.redirect("/index")
  }
});



module.exports = router;
