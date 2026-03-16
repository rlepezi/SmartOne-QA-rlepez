import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* El AppRouter contiene todas las definiciones de páginas y accesos */}
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;