/* eslint-disable max-len, require-jsdoc, valid-jsdoc */
/**
 * proyectosService.js
 * ÚNICA capa que toca Firestore para el módulo Proyectos.
 * El correlativo se genera solo en backend; el frontend no lo envía ni puede sobrescribirlo.
 * Fuente principal: _counters (transacción). Fallback: mayor correlativo en proyectos + 1.
 */

const {db} = require("../config/firebaseAdmin");

const COLLECTION = "proyectos";
/** Fuente principal del correlativo: documento _counters con campo correlativo (último usado). */
const COUNTER_DOC = db.collection("_counters").doc("proyectos");

const TRA_PREFIX = "TRA";
const CORRELATIVE_WIDTH = 7;

function formatIdProyecto(correlativo) {
  const n = Number(correlativo);
  const padded = String(n).padStart(CORRELATIVE_WIDTH, "0").slice(-CORRELATIVE_WIDTH);
  return `${TRA_PREFIX}${padded}`;
}

/**
 * Dentro de una transacción: lee _counters.correlativo, calcula siguiente (ultimo + 1),
 * actualiza _counters con el nuevo valor y devuelve ese valor para el documento.
 * Si _counters no existe o no tiene valor inicial, inicia desde 1.
 */
async function reserveNextIdProyecto(transaction) {
  const snap = await transaction.get(COUNTER_DOC);
  const current = snap.exists && typeof snap.data().correlativo === "number" ?
    snap.data().correlativo : 1;
  const next = current + 1;
  transaction.set(COUNTER_DOC, {correlativo: next}, {merge: true});
  return {idProyecto: formatIdProyecto(next), correlativo: next};
}

/**
 * Fallback solo si _counters no está disponible: obtiene el mayor correlativo
 * en la colección proyectos y devuelve ese valor + 1 (o 1 si no hay proyectos).
 */
async function getFallbackNextCorrelativo() {
  const snapshot = await db.collection(COLLECTION)
    .orderBy("correlativo", "desc")
    .limit(1)
    .get();
  const current = snapshot.empty ? 0 :
    (Number(snapshot.docs[0].data().correlativo) || 0);
  const next = current + 1;
  return {idProyecto: formatIdProyecto(next), correlativo: next};
}

function proyectoDocRef(proyectoId) {
  return db.collection(COLLECTION).doc(proyectoId);
}

/** Formato fecha para persistencia: YYYY-MM-DD (solo fecha local, sin zona horaria). */
function toYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Lista todos los proyectos. Conteos desde arrays empresas, personas, maquinarias.
 */
async function listProyectos() {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map((doc) => mapDocToListItem(doc.id, doc.data()));
}

function mapDocToListItem(id, data) {
  const nEmpresas = Array.isArray(data.empresas) ? data.empresas.length : 0;
  const nPersonas = Array.isArray(data.personas) ? data.personas.length : 0;
  const nMaquinarias = Array.isArray(data.maquinarias) ? data.maquinarias.length : 0;
  return {
    id,
    nombre: data.nombre != null ? data.nombre : "",
    idProyecto: data.idProyecto != null ? data.idProyecto : "",
    estado: data.estado != null ? String(data.estado) : null,
    fechaInicio: data.fechaInicio != null ? data.fechaInicio : null,
    fechaFin: data.fechaFin != null ? data.fechaFin : null,
    nEmpresas,
    nPersonas,
    nMaquinarias,
  };
}

/**
 * Detalle completo para edición (incluye descripción; no devuelve correlativo numérico suelto
 * si no está en el modelo; el idProyecto ya es el código visible).
 */
async function getProyectoById(proyectoId) {
  const doc = await db.collection(COLLECTION).doc(proyectoId).get();
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()};
}

/**
 * Crea proyecto. Correlativo e idProyecto se generan solo en backend; el payload
 * del frontend no puede enviarlos ni sobrescribirlos. Primero intenta transacción
 * con _counters; si falla, usa fallback (mayor correlativo en proyectos + 1).
 */
async function createProyecto(payload, usuarioCreador) {
  const {nombre, descripcion, fechaInicio, fechaFin, estado, region, comuna} = payload;

  const proyectoRef = db.collection(COLLECTION).doc();
  const now = new Date();
  const fechaCreacionStr = toYYYYMMDD(now);
  const estadoStr = estado === "2" ? "2" : "1";

  const regionStr = region != null ? String(region).trim() : "";
  const comunaStr = comuna != null ? String(comuna).trim() : "";
  const buildDocData = (idProyecto, correlativo) => ({
    correlativo,
    descripcion: descripcion != null ? String(descripcion) : "",
    empresas: [],
    estado: estadoStr,
    fechaCierre: "",
    fechaCreacion: fechaCreacionStr,
    fechaFin: fechaFin || null,
    fechaInicio: fechaInicio || null,
    idProyecto,
    maquinarias: [],
    nombre: nombre != null ? String(nombre).trim() : "",
    personas: [],
    region: regionStr,
    comuna: comunaStr,
    resumenEmpresas: [],
    resumenMaquinarias: [],
    resumenPersonas: [],
    usuarioCreador: usuarioCreador || null,
  });

  try {
    await db.runTransaction(async (transaction) => {
      const reserved = await reserveNextIdProyecto(transaction);
      transaction.set(proyectoRef, buildDocData(reserved.idProyecto, reserved.correlativo));
    });
  } catch (err) {
    const reserved = await getFallbackNextCorrelativo();
    await proyectoRef.set(buildDocData(reserved.idProyecto, reserved.correlativo));
    await COUNTER_DOC.set({correlativo: reserved.correlativo}, {merge: true});
  }

  const created = await proyectoRef.get();
  return {id: created.id, ...created.data()};
}

/**
 * Actualiza solo campos editables. Preserva idProyecto, correlativo, fechaCreacion,
 * usuarioCreador y todos los arrays (empresas, personas, maquinarias, resúmenes).
 */
async function updateProyecto(proyectoId, payload) {
  const ref = db.collection(COLLECTION).doc(proyectoId);
  const snap = await ref.get();
  if (!snap.exists) return null;

  const existing = snap.data();
  const update = {};
  if (payload.nombre !== undefined) update.nombre = String(payload.nombre).trim();
  if (payload.descripcion !== undefined) update.descripcion = String(payload.descripcion);
  if (payload.fechaInicio !== undefined) update.fechaInicio = payload.fechaInicio || null;
  if (payload.fechaFin !== undefined) update.fechaFin = payload.fechaFin || null;
  if (payload.estado !== undefined) {
    update.estado = payload.estado === "2" ? "2" : "1";
  }
  if (payload.region !== undefined) update.region = String(payload.region).trim();
  if (payload.comuna !== undefined) update.comuna = String(payload.comuna).trim();

  if (Object.keys(update).length === 0) {
    return {id: snap.id, ...existing};
  }

  await ref.update(update);
  const updated = await ref.get();
  return {id: updated.id, ...updated.data()};
}

module.exports = {
  listProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  proyectoDocRef,
  formatIdProyecto,
};
