var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creacion de Array Subdocumentos

var proveedorSchema = new Schema({ razonSocial: String, email: String });
var indicadorSchema = new Schema({ porc_rent: String });

// Creacion campos asociados al Producto

var schema = new Schema({
  codigo: { type: String },
  nombre: { type: String },
  descripcion: { type: String },
  rutaImagenes: { type: Array },
  categoria: { type: String },
  estado: { type: String },
  proveedores: [proveedorSchema],
  stock: { type: Number },
  valorCompra: { type: Number },
  ivaCompra: { type: Number },
  totalCompra: { type: Number },
  valorVenta: { type: Number },
  ivaVenta: { type: Number },
  totalVenta: { type: Number },
  rentabilidad: [indicadorSchema],
  observaciones: { type: String },
  companias: [{ type: Schema.Types.ObjectId, ref: 'companies' }]
});

module.exports = mongoose.model('products', schema);
