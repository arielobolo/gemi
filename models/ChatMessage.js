const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  participants: [String], // Identificadores de los dos participantes en la conversación
  messages: [{
    sender: String,      // ID del usuario que envió el mensaje
    receiver: String,    // ID del usuario que recibió el mensaje
    content: String,     // Contenido del mensaje
    read: Boolean,       // Indicador de si el mensaje ha sido leído
    timestamp: { type: Date, default: Date.now } // Fecha y hora del mensaje
  }]
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
