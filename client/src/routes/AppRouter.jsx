import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import Login from '../features/auth/Login';
import Dashboard from '../features/dashboard/Dashboard';
import AppLayout from '../layouts/AppLayout';
import ProyectosPage from '../features/proyectos/pages/ProyectosPage';
import ProyectoEditPage from '../features/proyectos/pages/ProyectoEditPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Mientras Firebase verifica la sesión, mostramos un spinner
  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, mandamos al login de inmediato
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay usuario, permitimos ver el contenido
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta de Login: Si ya está logueado, lo mandamos al dashboard */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Privadas envueltas en el Layout y la protección */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Al entrar a la raíz "/", redirigimos a dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Módulo de Proyectos */}
        <Route path="proyectos" element={<ProyectosPage />} />
        <Route path="proyectos/:id/editar" element={<ProyectoEditPage />} />
        
        {/* Aquí irán cayendo las otras rutas (Empresas, etc.) */}
      </Route>

      {/* Captura cualquier otra ruta y manda al login o dashboard según estado */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;