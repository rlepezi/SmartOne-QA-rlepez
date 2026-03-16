import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { callSmartOneApi } from '../../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // El token se genera y adjunta automáticamente en callSmartOneApi
          const profileData = await callSmartOneApi('/usuarios/perfil');
          
          setUser({
            uid: firebaseUser.uid,
            ...profileData
          });
        } catch (error) {
          console.error("Token de otro proyecto o usuario no existe en SmartOne:", error);
          
          // ¡ESTO ES CLAVE! 
          // Si el usuario existe en Auth pero no en tu API de SmartOne,
          // cerramos la sesión de Firebase para limpiar el localStorage.
          await auth.signOut(); 
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null); // Limpiamos el estado inmediatamente
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);