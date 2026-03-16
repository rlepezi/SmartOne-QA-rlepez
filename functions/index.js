const cloudFunctions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// 1. Importar Middlewares y Rutas
const validateToken = require('./src/middlewares/authMiddleware');
const userRoutes = require('./src/routes/userRoutes');
const proyectosRoutes = require('./src/routes/proyectosRoutes');
// const empresaRoutes = require('./src/routes/empresaRoutes'); // Próximamente

const app = express();

// 2. Configuración Global de Middlewares
// Permite que el frontend (localhost o hosting) consuma la API
app.use(cors({ origin: true })); 
app.use(express.json());

/**
 * 3. Middleware de Autenticación Centralizado
 * Todas las rutas que se definan después de esta línea requerirán 
 * un Token de Firebase válido enviado desde el cliente (Fetch).
 */
//app.use(validateToken);

// 4. Definición de Endpoints (Módulos)
// Esto mapea a: https://tu-region-proyecto.cloudfunctions.net/api/usuarios/...
app.use('/usuarios', userRoutes);
app.use('/proyectos', proyectosRoutes);

// Ejemplo de cómo se vería el siguiente módulo:
// app.use('/empresas', empresaRoutes);

/**
 * 5. Exportación de la Function 'api'
 * Este es el punto de entrada que configuramos en el firebase.json
 */
exports.api = cloudFunctions.https.onRequest(app);