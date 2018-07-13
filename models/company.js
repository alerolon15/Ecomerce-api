var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('mongoose-validator');
const ObjectID = mongoose.Schema.Types.ObjectId;
//Creacion de Array Subdocumentos
//
var telefonoSchema = new Schema({ fijo: Number, movil: String });
// debe checkear los tipos de redes sociales antes de agregar.
var redes_SocialesSchema = new Schema({ facebook: String, youtube: String });
// que es esto
var caracteristicas_NegocioSchema = new Schema({
  caracteristica_1: String,
  caracteristica_2: String,
  caracteristica_3: String
});
var producto_ServicioSchema = new Schema({
  producto_servicio_1: String,
  descripcion_1: String,
  producto_servicio_2: String,
  descripcion_2: String,
  producto_servicio_3: String,
  descripcion_3: String
});
//

var catalogo_ImagenesSchema = new Schema({
  imagen_principal: String,
  imagen_1: String,
  imagen_2: String,
  imagen_3: String,
  imagen_4: String,
  imagen_5: String,
  imagen_6: String
});

// Creacion campos asociados a la Empresa

var schema = new Schema({
  nombre_fantasia: { type: String, required: true, unique: true },
  quienes_somos: { type: String, required: true },
  que_hacemos: { type: String, required: true },
  //TODO: agregar schema de direccion
  direccion: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  telefono: [telefonoSchema],
  redes_sociales: [redes_SocialesSchema],
  caracteristicas_negocio: [caracteristicas_NegocioSchema],
  descripcion_producto_servicio: [producto_ServicioSchema],
  catalogo_imagenes: [catalogo_ImagenesSchema],
  productos: [{ type: ObjectID, ref: 'companies' }],
  active: { type: Boolean, default: true },
  url_key: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    unique: true
  },
  productos: [{ type: Schema.Types.ObjectId, ref: 'products' }]
});
schema.pre('save', function(next) {
  if (this.isModified('nombre_fantasia') || this.isNew) {
    this.url_key = NSTR(this.nombre_fantasia);
    next();
  } else {
    next();
  }
});
module.exports = mongoose.model('companies', schema);
