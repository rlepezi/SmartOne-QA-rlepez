import { auth } from './firebase';

// Selecciona automáticamente entre la URL local o la de producción
const BASE_URL = import.meta.env.DEV 
  ? import.meta.env.VITE_API_URL_LOCAL 
  : import.meta.env.VITE_API_PROD_URL;

export const callSmartOneApi = async (endpoint, options = {}) => {
  try {
    const user = auth.currentUser;
    let token = null;

    if (user) {
      // Obtenemos el token de sesión actual
      token = await user.getIdToken(true);
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API [${endpoint}]:`, error.message);
    throw error;
  }
};