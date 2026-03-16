import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' }); // 'error', 'success', 'loading'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Validando credenciales...' });
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Feedback de éxito antes de navegar
      setStatus({ type: 'success', msg: '¡Acceso correcto! Redirigiendo...' });
      
      // Pequeña pausa para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);

    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        msg: "Credenciales inválidas. Por favor, revisa tus datos." 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 transition-all">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">SmartOne <span className="text-blue-500">3.0</span></h1>
          <p className="text-slate-400 mt-3 font-medium">Plataforma de Validación Documental</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email con ID y Label asociado */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email" // Importante para Autofill
              type="email"
              autoComplete="username"
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              placeholder="ejemplo@empresa.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password con ID y Label asociado */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password" // Importante para Autofill
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Mensajes de Feedback */}
          <div className="min-h-[24px]"> 
            {status.msg && (
              <p className={`text-sm text-center font-bold animate-pulse ${
                status.type === 'error' ? 'text-red-400' : 
                status.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {status.msg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status.type === 'loading' || status.type === 'success'}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.type === 'loading' ? 'Procesando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;