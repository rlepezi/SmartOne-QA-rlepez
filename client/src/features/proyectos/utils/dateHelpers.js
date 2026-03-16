/**
 * Helpers seguros para fechas en formato YYYY-MM-DD.
 * Usados por KPIs de proyectos (por vencer, vencidos, etc.).
 */

const YYYY_MM_DD_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parsea una fecha en formato YYYY-MM-DD a Date (medianoche local).
 * @param {string} str - Fecha en YYYY-MM-DD
 * @returns {Date|null} Date en hora local o null si inválido
 */
export function parseDateYYYYMMDD(str) {
  if (typeof str !== 'string' || !YYYY_MM_DD_REGEX.test(str.trim())) {
    return null;
  }
  const [y, m, d] = str.trim().split('-').map(Number);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  const month = m - 1;
  if (month < 0 || month > 11) return null;
  const date = new Date(y, month, d);
  if (date.getFullYear() !== y || date.getMonth() !== month || date.getDate() !== d) {
    return null;
  }
  return date;
}

/**
 * Diferencia en días entre una fecha YYYY-MM-DD y hoy (fecha de referencia).
 * Positivo = fecha en el futuro, 0 = hoy, negativo = en el pasado.
 * @param {string} dateStr - Fecha en YYYY-MM-DD
 * @param {Date} [refDate] - Fecha de referencia (default: hoy a medianoche)
 * @returns {number|null} Días de diferencia o null si dateStr inválido
 */
export function daysFromToday(dateStr, refDate = null) {
  const date = parseDateYYYYMMDD(dateStr);
  if (!date) return null;
  const ref = refDate ? new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()) : getTodayStart();
  const diffMs = date.getTime() - ref.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Indica si la fecha YYYY-MM-DD está entre hoy y hoy + N días (inclusive).
 * @param {string} dateStr - Fecha en YYYY-MM-DD
 * @param {number} daysAhead - Días hacia adelante (ej. 30)
 * @returns {boolean}
 */
export function isBetweenTodayAndDaysAhead(dateStr, daysAhead) {
  const days = daysFromToday(dateStr);
  if (days === null) return false;
  return days >= 0 && days <= daysAhead;
}

/**
 * Indica si la fecha YYYY-MM-DD está en el pasado (antes de hoy).
 * Útil para KPI "vencidos".
 * @param {string} dateStr - Fecha en YYYY-MM-DD
 * @returns {boolean}
 */
export function isPast(dateStr) {
  const days = daysFromToday(dateStr);
  return days !== null && days < 0;
}

// --- UI: DD-MM-YYYY (display) ↔ YYYY-MM-DD (persistence). Solo fechas locales, sin zona horaria. ---

const DD_MM_YYYY_REGEX = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

/**
 * Parsea DD-MM-YYYY a partes (d, m, y) y valida. No usa Date hasta el final.
 * @param {string} str - Ej. "15-03-2025"
 * @returns {{ day: number, month: number, year: number } | null}
 */
function parseDDMMYYYYParts(str) {
  if (typeof str !== 'string') return null;
  const t = str.trim();
  if (!DD_MM_YYYY_REGEX.test(t)) return null;
  const [, dStr, mStr, yStr] = t.match(DD_MM_YYYY_REGEX);
  const day = Number(dStr);
  const month = Number(mStr);
  const year = Number(yStr);
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return { day, month, year };
}

/**
 * Convierte DD-MM-YYYY a YYYY-MM-DD (persistencia). Retorna null si inválido.
 * @param {string} str - Fecha en DD-MM-YYYY
 * @returns {string|null} YYYY-MM-DD o null
 */
export function ddmmYYYYToYYYYMMDD(str) {
  const p = parseDDMMYYYYParts(str);
  if (!p) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/**
 * Convierte YYYY-MM-DD a DD-MM-YYYY (UI). Retorna '' si entrada inválida.
 * @param {string} ymd - Fecha en YYYY-MM-DD
 * @returns {string} DD-MM-YYYY o ''
 */
export function yyyyMMDDToDDMMYYYY(ymd) {
  const date = parseDateYYYYMMDD(ymd);
  if (!date) return '';
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d)}-${pad(m)}-${pad(y)}`;
}

/**
 * Valida string en formato DD-MM-YYYY y que sea fecha real.
 * @param {string} str
 * @returns {boolean}
 */
export function isValidDDMMYYYY(str) {
  return parseDDMMYYYYParts(str) !== null;
}

/**
 * Aplica máscara de entrada: solo dígitos y guiones, formatea hacia DD-MM-YYYY.
 * @param {string} input - Lo que escribe el usuario
 * @returns {string} Valor enmascarado (ej. "15-03-2025" o "15-03-20")
 */
export function maskDDMMYYYY(input) {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
}
