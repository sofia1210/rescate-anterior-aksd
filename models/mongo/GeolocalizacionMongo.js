const mongoose = require('mongoose');

const GeolocalizacionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  descripcion: { type: String },
  animalId: { type: String, ref: 'Animal' },
  fechaRegistro: { type: Date, default: Date.now }
}, { _id: false, timestamps: true });

module.exports = mongoose.model('Geolocalizacion', GeolocalizacionSchema);
