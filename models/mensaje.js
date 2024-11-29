const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  title: String,
  body: String,
  resumen: String, // Añadir este campo
  createdAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters: [Schema.Types.Mixed] // Array para almacenar los IDs de usuarios que han votado
});

module.exports = mongoose.model('Message', messageSchema);
