var mongoose = require('mongoose');
var Pedido = require('../models/pedido');
mongoose.connect('localhost:27017/Aquosa');

var d = new Date();
var fechaHora = "";
      var d = new Date();
      var DD =  d.getDate();
      var MM =  d.getMonth() + 1;
      var YY =  d.getFullYear();

      fechaHora = "" + MM + "-" + DD + "-" +  YY;
console.log(fechaHora);
var carrito = [ { item:
     { _id: '5aea0e0485fdcf3910212fbc',
       codigo: 'MC12',
       titulo: 'The Macallan 12 años FINE OAK',
       descripcion: 'Una emocionante expresión de declaración de edad de Macallan que ha madurado en una combinación de roble de Jerez americano y europeo durante un mínimo de 12 años.\r\nColor: sol de cosecha.\r\nNariz: Buttercotch cremoso, toffee, naranja confitada y roble recién cortado.\r\nBoca: Equilibrado, dulzura de miel, cítricos y caramelo.\r\nAcabado: el roble persiste, cálido, dulce y seco.',
       precio: 1100,
       categoria: 'the macallan',
       cantidad: 750,
       __v: 0,
       imagenes: [Object] },
    qty: 1,
    price: 1100 },
  { item:
     { _id: '5aea0e8d85fdcf3910212fbd',
       codigo: 'MC18',
       titulo: 'The Macallan 18 años FINE OAK',
       descripcion: 'Macallan de 18 años hecho en barriles de jerez',
       precio: 5300,
       categoria: 'the macallan',
       cantidad: 750,
       __v: 0,
       imagenes: [Object] },
    qty: 2,
    price: 10600 }];

var userID = "5adf86f444743a17604aec83";
var direccion =  "Guemes 3311, piso 11 Depto 'A'";
var pagado =  true;
var entregado =  false;
var fechaPedido = fechaHora;
var fechaEntrega =  null;

console.log(carrito);
var data = {
  carrito,
  userID,
  direccion,
  pagado,
  entregado,
  fechaPedido,
  fechaEntrega
};

var pedido = new Pedido(data);
pedido.save(function(err){
  if (err) {console.log(err)}
  else { console.log(pedido) };
  mongoose.disconnect();
});
