/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const proyectosController = require("../controllers/proyectosController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, proyectosController.listProyectos);
router.get("/:id", authMiddleware, proyectosController.getProyectoById);
router.post("/", authMiddleware, proyectosController.createProyecto);
router.put("/:id", authMiddleware, proyectosController.updateProyecto);

module.exports = router;
