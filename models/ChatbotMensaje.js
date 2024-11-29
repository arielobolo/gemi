const mongoose = require('mongoose');

const chatbotMensajeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    horas: { type: Number, required: true },
    fechaGuardado: { type: Date, default: Date.now }  // Agregado para la fecha
});

module.exports = mongoose.model('ChatbotMensaje', chatbotMensajeSchema);
