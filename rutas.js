// rutas.js
const express = require('express');
const csrf = require('csurf');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// Configuración de csurf
const csrfProtection = csrf({ cookie: true });




// Ruta GET para renderizar el formulario de subida de imágenes de Gemini con protección CSRF
router.get('/', csrfProtection, async (req, res) => {
  try {
    const filePath = path.join(__dirname, './conversacion.txt');
    const conversacion = fs.readFileSync(filePath, 'utf-8');

    const historialArray = [];
    let currentEntry = null;

    conversacion.split('\n').forEach(line => {
      if (line.startsWith('Usuario:')) {
        // Guardar la respuesta anterior si existe
        if (currentEntry) historialArray.push(currentEntry);
        // Nueva entrada para el usuario
        currentEntry = { role: 'user', text: line.replace('Usuario: ', '') };
      } else if (line.startsWith(`${process.env.NOMBRE}:`)) {
        // Guardar la respuesta anterior si existe
        if (currentEntry) historialArray.push(currentEntry);
        // Nueva entrada para el bot
        currentEntry = { role: 'bot', text: line.replace(`${process.env.NOMBRE}: `, '') };
      } else if (currentEntry && currentEntry.role === 'bot') {
        // Si la línea es parte de la respuesta del bot, añadirla
        currentEntry.text += '\n' + line;
      }
    });

    // Agregar el último entry si existe
    if (currentEntry) historialArray.push(currentEntry);

    res.render('gemini', { csrfToken: req.csrfToken(), historial: historialArray, nombreBot: process.env.NOMBRE });

  } catch (error) {
    console.error("Error al cargar la conversación:", error);
    res.render('gemini', { csrfToken: req.csrfToken(), historial: [], nombreBot: process.env.NOMBRE });
  }
});






const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ajustarRespuesta } = require('./responseHandler');

router.post('/gemini', csrfProtection, async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b-exp-0924",
      systemInstruction: "Te llamas Pushi y eres un asistente del SEP."
    });

    const prompt = req.body.prompt;
    if (!prompt || !prompt.trim()) throw new Error("Prompt vacío o no recibido");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Ajustar respuesta solo si es necesario
    const adjustedResponse = ajustarRespuesta(prompt) || responseText;

    res.json({ response: { text: adjustedResponse } });
  } catch (error) {
    console.error("Error al interactuar con Gemini:", error);
    res.status(500).json({ error: "Error al interactuar con Gemini" });
  }
});





// Ruta GET para mostrar el editor JSON, protegida con CSRF
router.get('/editorjson', csrfProtection, (req, res) => {
  const filePath = path.join(__dirname, 'personalidad.json');
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error al leer el archivo JSON');
      }
      const jsonData = JSON.parse(data);
      res.render('editorjson', { jsonData, csrfToken: req.csrfToken() });
  });
});

// Ruta POST para guardar los cambios en el JSON usando AJAX
router.post('/editorjson', csrfProtection, (req, res) => {
  const filePath = path.join(__dirname, 'personalidad.json');
  const newJsonData = req.body.jsonData;

  fs.writeFile(filePath, JSON.stringify(newJsonData, null, 2), 'utf-8', (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error al guardar el archivo JSON');
      }
      res.send('Archivo JSON guardado con éxito');
  });
});

// Ruta POST para resetear la conversación
router.post('/clear-conversation', (req, res) => {
  const conversationFilePath = path.join(__dirname, 'conversacion.txt');
  const initialContent = `Usuario: Hola\n${process.env.NOMBRE}: Hola, soy el asistente virtual del SEP ¿En qué puedo ayudarte hoy?`;

  fs.writeFile(conversationFilePath, initialContent, 'utf8', (err) => {
      if (err) {
          console.error("Error al resetear el contenido de la conversación:", err);
          return res.status(500).send('Error al resetear la conversación');
      }
      res.send('Conversación reseteada');
  });
});




router.get('/voz', csrfProtection, async (req, res) => {

  res.render('voz', {  csrfToken: req.csrfToken() });

});

module.exports = router;
