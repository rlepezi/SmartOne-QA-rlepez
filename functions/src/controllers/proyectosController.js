/* eslint-disable max-len, require-jsdoc */
const proyectosService = require("../services/proyectosService");

function validateCreateBody(body) {
  const errors = [];
  if (!body.nombre || !String(body.nombre).trim()) errors.push("nombre es requerido");
  if (!body.fechaInicio) errors.push("fechaInicio es requerida");
  if (!body.fechaFin) errors.push("fechaFin es requerida");
  if (body.fechaInicio && body.fechaFin && body.fechaFin < body.fechaInicio) {
    errors.push("fechaFin no puede ser anterior a fechaInicio");
  }
  if (body.estado !== undefined && body.estado !== "1" && body.estado !== "2") {
    errors.push("estado debe ser 1 o 2");
  }
  return errors;
}

function validateUpdateBody(body) {
  const errors = [];
  if (body.nombre !== undefined && !String(body.nombre).trim()) errors.push("nombre no puede estar vacío");
  if (body.fechaInicio && body.fechaFin && body.fechaFin < body.fechaInicio) {
    errors.push("fechaFin no puede ser anterior a fechaInicio");
  }
  if (body.estado !== undefined && body.estado !== "1" && body.estado !== "2") {
    errors.push("estado debe ser 1 o 2");
  }
  return errors;
}

exports.listProyectos = async (req, res) => {
  try {
    const list = await proyectosService.listProyectos();
    res.json(list);
  } catch (error) {
    console.error("listProyectos", error);
    res.status(500).json({message: "Error al listar proyectos", error: error.message});
  }
};

exports.getProyectoById = async (req, res) => {
  try {
    const {id} = req.params;
    const proyecto = await proyectosService.getProyectoById(id);
    if (!proyecto) {
      return res.status(404).json({message: "Proyecto no encontrado"});
    }
    res.json(proyecto);
  } catch (error) {
    console.error("getProyectoById", error);
    res.status(500).json({message: "Error al obtener proyecto", error: error.message});
  }
};

exports.createProyecto = async (req, res) => {
  try {
    const errors = validateCreateBody(req.body);
    if (errors.length) {
      return res.status(400).json({message: errors.join(". ")});
    }
    const usuarioCreador = (req.user && req.user.uid) ||
      (req.user && req.user.email) || null;
    const created = await proyectosService.createProyecto(req.body, usuarioCreador);
    res.status(201).json(created);
  } catch (error) {
    console.error("createProyecto", error);
    res.status(500).json({message: "Error al crear proyecto", error: error.message});
  }
};

exports.updateProyecto = async (req, res) => {
  try {
    const errors = validateUpdateBody(req.body);
    if (errors.length) {
      return res.status(400).json({message: errors.join(". ")});
    }
    const {id} = req.params;
    const updated = await proyectosService.updateProyecto(id, req.body);
    if (!updated) {
      return res.status(404).json({message: "Proyecto no encontrado"});
    }
    res.json(updated);
  } catch (error) {
    console.error("updateProyecto", error);
    res.status(500).json({message: "Error al actualizar proyecto", error: error.message});
  }
};
