const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');
const pdf = require('pdf-parse');

// Cargar respuestas desde un archivo JSON
const respuestas = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'respuestas.json'), 'utf8')
);

// Variable para almacenar el contenido del PDF
let contenidoPDF = "";

// Función para extraer el texto del PDF y almacenarlo en una variable
function extraerTextoDePDF(rutaPDF) {
  const pdfBuffer = fs.readFileSync(rutaPDF);

  return pdf(pdfBuffer).then(function(data) {
    contenidoPDF = data.text;
    console.log("Texto del PDF cargado correctamente.");
  });
}

// Cargar el contenido del PDF al iniciar
const rutaPDF = path.join(__dirname, 'crebro.pdf'); // Usar __dirname para obtener la ruta correcta
extraerTextoDePDF(rutaPDF);

// Función para ajustar la respuesta basándose en el JSON o el PDF
function ajustarRespuesta(prompt) {
  const preguntaMinuscula = prompt.toLowerCase().trim();

  // Saludo inicial
  if (preguntaMinuscula.startsWith("hola") || preguntaMinuscula.startsWith("buenas") || preguntaMinuscula.includes("saludos")) {
    return "Hola! ¿En qué puedo ayudarte?";
  }

  // dolar
  if (preguntaMinuscula.startsWith("precio dolar") || preguntaMinuscula.startsWith("dolar") || preguntaMinuscula.includes("cambio")) {
    return "Hola! el precio del dolar es $1400";
  }

  // Buscar todas las respuestas relevantes en el JSON usando similitud de texto
  const respuestasRelevantes = new Set(); // Usamos un Set para evitar duplicados

  respuestas.forEach((respuesta) => {
    respuesta.clave.forEach((clave) => {
      const similitud = stringSimilarity.compareTwoStrings(preguntaMinuscula, clave);

      if (similitud > 0.3) { // Umbral ajustable
        respuestasRelevantes.add(respuesta.respuesta); // Agregar respuesta al Set
      }
    });
  });

  // Si hay respuestas relevantes en el JSON, combinarlas
  if (respuestasRelevantes.size > 0) {
    return Array.from(respuestasRelevantes).join('\n\n');
  }

  // Si no se encuentra coincidencia en el JSON, buscar en el PDF
  const coincidenciaPDF = buscarEnPDF(preguntaMinuscula);
  if (coincidenciaPDF) {
    return coincidenciaPDF;
  }

  // Si no hay coincidencias, la IA Gemini responde libremente
  return null; // Retorna null para delegar la respuesta a la IA Gemini
}

// Función para buscar una coincidencia en el contenido del PDF
function buscarEnPDF(pregunta) {
  const frasesPDF = contenidoPDF.split('. '); // Dividir el texto del PDF en frases para buscar similitudes

  let mejorCoincidencia = null;
  let mejorSimilitud = 0;

  frasesPDF.forEach((frase) => {
    const similitud = stringSimilarity.compareTwoStrings(pregunta, frase.toLowerCase().trim());

    if (similitud > mejorSimilitud) {
      mejorSimilitud = similitud;
      mejorCoincidencia = frase;
    }
  });

  // Ajustar el umbral de similitud para el PDF (puedes experimentar con el valor)
  if (mejorSimilitud > 0.3) {
    return mejorCoincidencia;
  }

  return null;
}

module.exports = { ajustarRespuesta };