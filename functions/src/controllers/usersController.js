const usersService = require('../services/usersService');

exports.getUserMe = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userData = await usersService.getUserByAuthId(uid);

    if (!userData) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};