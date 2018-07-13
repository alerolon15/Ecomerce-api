var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Producto = require('../../models/producto');
var Carrito = require('../../models/carrito');

router.get('/:id', function(req, res, next) {
    var productId = req.params.id;
    var carrito = new Carrito(req.session.user.carrito ? req.session.user.carrito : {});

    Producto.findById(productId, function(err, producto) {
       if (err) {
           return res.redirect('/index');
       }
       carrito.add(producto, producto.id);
       req.session.user.carrito = carrito;
       res.send(req.session.user.carrito);
       //res.redirect('/index');
       //var carritoString = JSON.stringify(carrito);
       //console.log(carritoString);
    });
});

module.exports = router;
