const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  articulo: {
    type: String,
 
    unique: true, // Asegura que no haya artículos duplicados
  },
  precio: {
    type: Number,
   
  },
  descripcion: {
    type: String,
  
  },
  stock: {
    type: Number,
    default: 0, // Por defecto, el stock es 0
  },
}, {
  timestamps: true, // Agrega timestamps de creación y actualización
});

// Crear el modelo
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
