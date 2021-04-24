const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var usuarioCriptomonedaSchema = new Schema({
  simbolo: {
    type: String,
    required: true,
  },
  idmoneda: {
    type: String,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
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

module.exports = mongoose.model(
  "usuarioCriptomoneda",
  usuarioCriptomonedaSchema
);
