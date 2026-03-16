const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Exportamos admin (el SDK completo) y db (la instancia de base de datos)
module.exports = { admin, db };