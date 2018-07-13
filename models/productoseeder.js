var mongoose = require('mongoose');
var Producto = require('../models/producto');
mongoose.connect('localhost:27017/Aquosa');

var proveedorSchema = { razonSocial: 'razonSocial', email: 'razonsocial@social.com' };
var indicadorSchema = { porc_rent: 10 };

var data = {
  codigo: 'COD001',
  nombre: 'Macallan 12 años',
  descripcion: 'whisky añejo',
  imagenes: [],
  categoria: 'The Macallan',
  estado: 'estado',
  proveedores: [proveedorSchema],
  stock: 100,
  valorCompra: 800,
  ivaCompra: 21,
  totalCompra: 900,
  valorVenta: 1600,
  ivaVenta: 21,
  totalVenta: 1700,
  rentabilidad: [indicadorSchema],
  observaciones: 'observacionesString',
  urlcompanias: 'mistralshoes',
  companias: ['5b46a9593ca77c038ce582cf']
};

data.imagenes.push("producto3-1.jpg", "producto3-2.jpg", "producto3-3.jpg");

var producto = new Producto(data);
producto.save(function(err){
  if (err) {console.log(err)}
  else { console.log(producto) };
  mongoose.disconnect();
});
