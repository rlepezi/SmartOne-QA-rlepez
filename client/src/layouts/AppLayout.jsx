import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  FolderKanban,
  Building2,
  Users,
  Truck,
  ClipboardList,
  UserCheck,
  Wrench,
  ListChecks,
  Tags,
  UsersRound,
  FileCheck,
  Bot,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const menuSections = [
  {
    title: 'VISIÓN GLOBAL',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/alertas', label: 'Alertas Críticas', icon: AlertTriangle },
    ],
  },
  {
    title: 'GESTIÓN DE ACTIVOS',
    items: [
      { to: '/proyectos', label: 'Proyectos', icon: FolderKanban },
      { to: '/empresas', label: 'Empresas', icon: Building2 },
      { to: '/personas', label: 'Dotación (Personas)', icon: Users },
      { to: '/maquinarias', label: 'Parque Maquinaria', icon: Truck },
    ],
  },
  {
    title: 'OPERACIONES (EVALUACIÓN)',
    items: [
      { to: '/evaluacion-empresas', label: 'Evaluación de Empresas', icon: ClipboardList },
      { to: '/evaluacion-personas', label: 'Evaluación de Personas', icon: UserCheck },
      { to: '/evaluacion-maquinarias', label: 'Evaluación de Maquinarias', icon: Wrench },
    ],
  },
  {
    title: 'CONFIGURACIÓN',
    items: [
      { to: '/configuracion/matriz', label: 'Matriz de Requerimientos', icon: ListChecks },
      { to: '/configuracion/tipos', label: 'Tipos y Categorías', icon: Tags },
      { to: '/configuracion/usuarios', label: 'Usuarios del Sistema', icon: UsersRound },
    ],
  },
  {
    title: 'REPORTABILIDAD',
    items: [
      { to: '/reportes/certificados', label: 'Certificados de Aprobación', icon: FileCheck },
      { to: '/reportes/ia-log', label: 'Log de Auditoría IA', icon: Bot },
    ],
  },
];

const NavLinkItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end={to === '/dashboard'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    <Icon className="shrink-0 size-5" aria-hidden />
    <span className="truncate">{label}</span>
  </NavLink>
);

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 max-w-[85vw]
          flex flex-col bg-slate-900 text-white
          transform transition-transform duration-200 ease-out
          lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header con toggle móvil */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-800 shrink-0">
          <span className="text-xl font-bold text-blue-500 truncate">SmartOne 3.0</span>
          <button
            type="button"
            aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Navegación con scroll independiente */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLinkItem to={item.to} label={item.label} icon={item.icon} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Usuario y Cerrar sesión anclado abajo */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.nombre || 'Usuario'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.rol ?? '—'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-sm font-medium rounded-lg transition-colors border border-red-500/20"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal: scroll independiente y fondo slate-50 */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-w-0 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
