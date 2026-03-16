const Dashboard = () => {
    return (
      <div className="text-slate-800">
        <h1 className="text-2xl font-bold mb-4">Dashboard SmartOne 3.0</h1>
        <p className="text-slate-600">Bienvenido, aquí verás las estadísticas globales.</p>
        
        {/* Grid de KPIs (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-slate-500 text-sm font-medium">Empresas Activas</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">--</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-slate-500 text-sm font-medium">Proyectos</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">--</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <span className="text-slate-500 text-sm font-medium">Cumplimiento Global</span>
            <div className="text-3xl font-bold text-blue-600 mt-1">--%</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;