const mongoose = require('mongoose');

const scanHorasSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al modelo User
  qrResult: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  horaIngreso: { type: String }, // Campo para hora de ingreso
  horaEgreso: { type: String },   // Campo para hora de egreso
  estado: { type: String, enum: ['ingreso', 'egreso'], default: 'ingreso' }, // Estado actual
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

// Crear el modelo
const ScanHoras = mongoose.model('ScanHoras', scanHorasSchema);
module.exports = ScanHoras;
