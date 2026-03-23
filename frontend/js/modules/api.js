/**
 * api.js
 * Capa de abstracción para requests al backend
 * Preparada para producción: cambia BASE_URL según entorno
 */

const BASE_URL = '/api';

/**
 * Request genérico con manejo de errores
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * API methods — conectan con el backend cuando esté disponible
 */
export const api = {
  getProducts: ()        => request('/products'),
  getCourses:  ()        => request('/courses'),
  chat:        (message) => request('/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
};

/**
 * Fallback: cargar datos estáticos desde /data/*.json
 * Se usa cuando el backend no está disponible
 * @param {string} path - ruta relativa al archivo JSON
 */
export async function loadLocal(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar: ${path}`);
  return res.json();
}
