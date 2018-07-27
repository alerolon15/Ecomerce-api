var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Pedido = require('../../models/pedido');


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session && req.session.user){
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
