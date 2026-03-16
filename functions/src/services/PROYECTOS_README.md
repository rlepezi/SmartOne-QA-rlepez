# Módulo Proyectos – Backend

## Estructura del documento en `proyectos`

Cada documento tiene:

- `correlativo` (number)
- `descripcion` (string)
- `empresas` (array)
- `estado` (string: `"1"` Abierto, `"2"` Cerrado)
- `fechaCreacion` (string YYYY-MM-DD)
- `fechaFin`, `fechaInicio` (string YYYY-MM-DD)
- `idProyecto` (string, ej. TRA1124011)
- `maquinarias` (array)
- `nombre` (string)
- `personas` (array)
- `resumenEmpresas`, `resumenMaquinarias`, `resumenPersonas` (array)
- `usuarioCreador` (string, uid del usuario)

Al crear se inicializan `empresas`, `personas`, `maquinarias`, `resumenEmpresas`, `resumenMaquinarias`, `resumenPersonas` como `[]`.

## Generación del código `TRA...`

- **Dónde:** `proyectosService.js` → `reserveNextIdProyecto` dentro de una transacción.
- **Contador:** documento `_counters/proyectos` con campo numérico `correlativo`.
- **Formato:** prefijo `TRA` + correlativo a 7 dígitos (ej. `TRA1124011`). El mismo número se persiste en el documento como `correlativo`.
- **Edición:** no se regenera `idProyecto` ni `correlativo`; se preservan además `fechaCreacion`, `usuarioCreador` y todos los arrays.

## Endpoints

- `GET /proyectos` – listado (conteos desde `empresas.length`, etc.)
- `GET /proyectos/:id` – detalle
- `POST /proyectos` – creación (backend completa correlativo, idProyecto, fechaCreacion, usuarioCreador, arrays vacíos)
- `PUT /proyectos/:id` – actualización solo de nombre, descripcion, estado, fechaInicio, fechaFin

Todos con `authMiddleware`.
