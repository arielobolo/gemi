const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reglas.json');

// Función para cargar las reglas desde el archivo
function cargarReglas() {
  try {
    const reglas = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(reglas);
  } catch (error) {
    console.error('Error al cargar las reglas:', error);
    return []; // Retorna un array vacío si hay error
  }
}

// Función para guardar una nueva regla
function guardarRegla(nuevaRegla) {
  const reglas = cargarReglas();
  reglas.push(nuevaRegla);

  try {
    fs.writeFileSync(filePath, JSON.stringify(reglas, null, 2));
    console.log('Regla guardada correctamente.');
  } catch (error) {
    console.error('Error al guardar la regla:', error);
  }
}

// Función para validar si una respuesta viola alguna regla
function validarReglas(prompt) {
  const reglas = cargarReglas();
  
  for (let regla of reglas) {
    if (prompt.toLowerCase().includes(regla.toLowerCase())) {
      return `No permitido: la regla "${regla}" ha sido violada.`;
    }
  }

  return null; // Si no hay violación, retornar null
}

module.exports = { cargarReglas, guardarRegla, validarReglas };
