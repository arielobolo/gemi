// models/Medico.js
const mongoose = require('mongoose');

// Definir el esquema para Medico
const MedicoSchema = new mongoose.Schema({
  medico: {
    type: String,
    required: true,
    trim: true
  },
  especialidad: {
    type: String,
    required: true,
    trim: true
  },
  horaDeAtencion: {
    type: String,
    required: true
  }
});

// Crear el modelo basado en el esquema
const Medico = mongoose.model('Medico', MedicoSchema);

module.exports = Medico;
