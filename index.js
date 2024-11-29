// app.js
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const rutas = require('./rutas');
const connectDB = require('./config/db');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
// Configuración de dotenv
dotenv.config();
// Conectar a MongoDB
connectDB();
// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Motor de vistas
app.set('view engine', 'ejs');


// Archivos estáticos
app.use(express.static('public'));
// Configura Body-Parser para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));


// Rutas
app.use('/', rutas);

const csrfProtection = csrf({ cookie: true });




// Ruta GET para mostrar el formulario con los valores de .env
app.get('/config', csrfProtection, (req, res) => {
    const envConfig = {
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        PUBLICVAPIS: process.env.PUBLICVAPIS,
        PRIVATEVAPID: process.env.PRIVATEVAPID,
        API_KEY: process.env.API_KEY,
        NOMBRE: process.env.NOMBRE,
    };

    res.render('config', { envConfig, csrfToken: req.csrfToken() });
});

// Ruta POST para guardar los cambios en el archivo .env
app.post('/config', (req, res) => {
    const newConfig = {
        PORT: req.body.PORT,
        MONGO_URI: req.body.MONGO_URI,
        PUBLICVAPIS: req.body.PUBLICVAPIS,
        PRIVATEVAPID: req.body.PRIVATEVAPID,
        API_KEY: req.body.API_KEY,
        NOMBRE: req.body.NOMBRE,
    };

    // Convertir los datos en formato .env
    const envContent = Object.entries(newConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    // Escribir el nuevo contenido en el archivo .env
    fs.writeFileSync('.env', envContent);

    // Forzar reinicio escribiendo en reinicio.js
    fs.writeFileSync('reinicio.js', `// Reinicio forzado: ${new Date()}`);

    // Recargar las variables de entorno con los nuevos valores
    dotenv.config();

    res.send('Archivo .env actualizado con éxito. El servidor se reiniciará.');
});


// Función para obtener la hora actual en Argentina
function obtenerHoraArgentina() {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Función para obtener la hora actual en Argentina
function obtenerHoraArgentina() {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Función para eliminar una carpeta y su contenido
function eliminarCarpetaYContenido(carpeta) {
    fs.rmdir(carpeta, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error al eliminar la carpeta ${carpeta}:`, err);
        } else {
            console.log(`La carpeta ${carpeta} y su contenido han sido eliminados exitosamente.`);
        }
    });
}

//-----------------------------------------------------------------------------------------



// Función para obtener la hora actual en Argentina
function obtenerHoraArgentina() {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Función para eliminar una carpeta y su contenido
function eliminarCarpetaYContenido(carpeta) {
    fs.rmdir(carpeta, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error al eliminar la carpeta ${carpeta}:`, err);
        } else {
            console.log(`La carpeta ${carpeta} y su contenido han sido eliminados exitosamente.`);
            crearCarpeta(carpeta); // Crear la carpeta nuevamente después de eliminarla
        }
    });
}

// Función para crear la carpeta
function crearCarpeta(carpeta) {
    fs.mkdir(carpeta, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error al crear la carpeta ${carpeta}:`, err);
        } else {
            console.log(`La carpeta ${carpeta} ha sido creada exitosamente.`);
        }
    });
}

// Función para programar la eliminación de la carpeta a las 17:50
function scheduleFolderDeletion() {
    const targetHour = 17;
    const targetMinute = 34;

    // Obtiene la hora actual
    const now = new Date();
    const horaArgentina = obtenerHoraArgentina();
    console.log("Hora actual en Argentina:", horaArgentina);

    // Configura la hora de eliminación
    const targetTime = new Date(now);
    targetTime.setHours(targetHour, targetMinute, 0, 0);

    // Si la hora objetivo ya pasó hoy, programa para mañana
    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    console.log("Hora objetivo:", targetTime.toLocaleTimeString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }));

    // Calcula el tiempo en milisegundos hasta la hora objetivo
    const timeUntilDeletion = targetTime - now;

    setTimeout(() => {
        const carpeta = path.join(__dirname, 'conversaciones');
        eliminarCarpetaYContenido(carpeta);
    }, timeUntilDeletion);
}

// Llamar a la función para programar la eliminación
scheduleFolderDeletion();


//-----------------------------------------------------------------------------------------


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
