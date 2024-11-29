const mongoose = require('mongoose');

const encuestaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  dato1: { type: String, required: true },
  dato2: { type: String, required: true },
  dato3: { type: String, required: true },
  voto1: { type: Number, default: 0 },
  voto2: { type: Number, default: 0 },
  voto3: { type: Number, default: 0 },
  idVotos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // IDs de usuarios que ya votaron
}, {
  timestamps: true // Agrega los campos createdAt y updatedAt
});

module.exports = mongoose.model('Encuesta', encuestaSchema);
