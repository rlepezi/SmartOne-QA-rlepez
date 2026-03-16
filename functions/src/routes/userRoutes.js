const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");

// Obtener perfil del usuario conectado
// Nota: Cambiamos /perfil por /me para seguir tu estándar
router.get("/perfil", authMiddleware, usersController.getUserMe);

// Otras rutas futuras
// router.post("/", authMiddleware, usersController.createUser);
// router.put("/:id", authMiddleware, usersController.updateUser);

module.exports = router;