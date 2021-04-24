const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  apellido: {
    type: String,
    required: true,
  },
  usuario: {
    type: String,
    index: true,
    unique: true,
  },
  clave: {
    type: String,
    required: true,
  },
  moneda: {
    type: String,
    required: true,
    enum: ["usd", "eur", "ars"],
  },
  estado: {
    type: Boolean,
    required: false,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
