var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pedidoSchema = new Schema({
  carrito: {type: Array, required:true},
  userID: {type: Schema.Types.ObjectId, required:true},
  direccion: {type: String},
  tipoPago: {type: String},
  tipoEntrega: {type: String},
  pagado: Boolean,
  entregado: Boolean,
  fechaPedido: {type: String, required:true},
  fechaEntrega: {type: String},
  factura: {type: String},
});

module.exports = mongoose.model('Pedido', pedidoSchema);
