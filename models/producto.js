const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var proveedorSchema = new Schema({ razonSocial: String, email: String });
var indicadorSchema = new Schema({ porc_rent: String });

var productoSchema = new Schema({
  codigo: { type: String },
  nombre: { type: String },
  descripcion: { type: String },
  imagenes: [String],
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
  urlcompanias: { type: String },
  companias: [{ type: Schema.Types.ObjectId, ref: 'companies' }]
});

module.exports = mongoose.model('Producto', productoSchema);
