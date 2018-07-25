var mongoose = require('mongoose');
var Producto = require('../models/producto');
mongoose.connect('localhost:27017/Aquosa');

var proveedorSchema = { razonSocial: 'razonSocial', email: 'razonsocial@social.com' };
var indicadorSchema = { porc_rent: 10 };

var data = {
  codigo: 'COD002',
  nombre: 'Macallan 15 años',
  descripcion: 'whisky re añejo',
  imagenes: [],
  categoria: 'The Macallan',
  estado: 'estado',
  proveedores: [proveedorSchema],
  stock: 15,
  valorCompra: 800,
  ivaCompra: 21,
  totalCompra: 900,
  valorVenta: 1600,
  ivaVenta: 21,
  totalVenta: 1800,
  rentabilidad: [indicadorSchema],
  observaciones: 'observacionesString',
  urlcompanias: 'mistralshoes',
  companias: ['5b5789cfa1e9ea04ac38b4e2']
};

data.imagenes.push("Producto14.jpg");

var producto = new Producto(data);
producto.save(function(err){
  if (err) {console.log(err)}
  else { console.log(producto) };
  mongoose.disconnect();
});
