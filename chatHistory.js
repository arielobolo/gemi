// Segundo archivo, importando reglas desde responsehandle.js
const fs = require('fs');
const { reglas } = require('./responseHandler'); // Importa las reglas desde responsehandle.js

function cargarHistorial() {
  try {
    const historial = fs.readFileSync('conversacion.txt', 'utf-8');
    const historialArray = historial.split('\n').map(item => {
      const parts = item.split('\n');
      const role = parts[0].startsWith('Usuario') ? 'user' : 'model';
      let text = parts[1] ? parts[1].substring(parts[1].indexOf(':') + 2) : '';
      return { role, parts: [{ text }] };
    });

    // Usar las reglas de parametrosIniciales en lugar de leer directamente personalidad.json
    reglas.forEach(regla => {
      historialArray.push({ role: 'model', parts: [{ text: regla }] });
    });

    return historialArray;

  } catch (error) {
    console.error("Error al cargar el historial:", error);
    return [];
  }
}

function guardarHistorial(prompt, responseText) {
  const nombreBot = process.env.NOMBRE;
  const historial = `Usuario: ${prompt}\n${nombreBot}: ${responseText}`;
  fs.appendFile('conversacion.txt', historial, (err) => {
    if (err) console.error("Error al guardar el historial:", err);
    else console.log("Historial guardado correctamente.");
  });
}

module.exports = { cargarHistorial, guardarHistorial };
