const { admin } = require('../config/firebaseAdmin');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Validamos el token con el SDK de Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Inyectamos el usuario decodificado en la petición para los controladores
    req.user = decodedToken;
    
    next(); // Continuar al controlador
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;