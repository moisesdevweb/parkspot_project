import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DasboardGeneral/DashboardLayout';
import StatsCard from '../../components/DasboardGeneral/StatsCard';
import CircularProgress from '../../components/DasboardGeneral/CircularProgress';
import Loader from '../../components/DasboardGeneral/Loader';
import { clearAuth, getUser } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardCliente = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticasCliente();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarEstadisticasCliente = async () => {
    try {
      setLoading(true);
      
      // Por ahora solo usamos datos simulados hasta que tengas el endpoint específico
      const misReservas = obtenerMisReservas();
      
      setEstadisticas({
        reservas: misReservas,
        espaciosDisponibles: 25, // Dato simulado
      });
    } catch (error) {
      toast.error('Error al cargar las estadísticas');
      console.error('Error:', error);
      // Datos por defecto en caso de error
      setEstadisticas({
        reservas: { total: 0, pendientes: 0, confirmadas: 0, utilizadas: 0, canceladas: 0 },
        espaciosDisponibles: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const obtenerMisReservas = async () => {
    // Aquí podrías implementar un endpoint específico como /api/cliente/mis-reservas
    // Por ahora, devolvemos datos simulados
    return {
      total: 5,
      pendientes: 1,
      confirmadas: 2,
      utilizadas: 2,
      canceladas: 0
    };
  };

  if (loading) {
    return (
      <DashboardLayout
        user={user}
        onLogout={() => { clearAuth(); navigate("/login"); }}
        onProfile={() => navigate("/dashboard/profile")}
        onNavigate={navigate}
      >
        <div className="flex items-center justify-center h-64">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (!estadisticas) {
    return (
      <DashboardLayout
        user={user}
        onLogout={() => { clearAuth(); navigate("/login"); }}
        onProfile={() => navigate("/dashboard/profile")}
        onNavigate={navigate}
      >
        <div className="text-center text-gray-400 py-8">
          No se pudieron cargar las estadísticas
        </div>
      </DashboardLayout>
    );
  }

  const { reservas } = estadisticas;

  return (
    <DashboardLayout
      user={user}
      onLogout={() => { clearAuth(); navigate("/login"); }}
      onProfile={() => navigate("/dashboard/profile")}
      onNavigate={navigate}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Dashboard</h1>
          <p className="text-gray-400">Bienvenido {user.username}, aquí tienes tu resumen personal</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Mis Reservas Totales"
            value={reservas.total}
            subtitle="Reservas realizadas"
            icon="📅"
            color="blue"
          />
          <StatsCard
            title="Reservas Pendientes"
            value={reservas.pendientes}
            subtitle="Esperando confirmación"
            icon="⏰"
            color="yellow"
          />
          <StatsCard
            title="Reservas Confirmadas"
            value={reservas.confirmadas}
            subtitle="Listas para usar"
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Espacios Disponibles"
            value={estadisticas.espaciosDisponibles}
            subtitle="Disponibles ahora"
            icon="🅿️"
            color="purple"
          />
        </div>

        {/* Sección de Análisis Personal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado de Mis Reservas */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Mis Reservas</h3>
            <div className="flex items-center justify-center mb-6">
              <CircularProgress 
                percentage={reservas.total > 0 ? (reservas.utilizadas / reservas.total) * 100 : 0}
                color="green"
                size={140}
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">Tasa de Utilización</p>
              <p className="text-white text-lg font-bold">
                {reservas.total > 0 ? Math.round((reservas.utilizadas / reservas.total) * 100) : 0}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">Utilizadas</span>
                </div>
                <p className="text-white text-lg font-bold">{reservas.utilizadas}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">Canceladas</span>
                </div>
                <p className="text-white text-lg font-bold">{reservas.canceladas}</p>
              </div>
            </div>
          </div>

          {/* Estado del Estacionamiento */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Estado del Estacionamiento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 font-medium">Espacios Disponibles</span>
                </div>
                <span className="text-white font-bold text-xl">{estadisticas.espaciosDisponibles}</span>
              </div>
              
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">Estado Actual</p>
                <p className="text-white font-medium">
                  {estadisticas.espaciosDisponibles > 0 
                    ? "¡Perfecto momento para reservar!" 
                    : "Sin espacios disponibles en este momento"
                  }
                </p>
              </div>

              <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">Tip del día</p>
                <p className="text-white text-sm">
                  Las horas de menor ocupación son entre 2:00 PM - 4:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard/estacionamiento')}
              className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <span className="text-xl">🅿️</span>
              <div className="text-left">
                <p className="text-white font-medium">Ver Estacionamiento</p>
                <p className="text-blue-200 text-sm">Estado en tiempo real</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/reservas')}
              className="flex items-center gap-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <span className="text-xl">📅</span>
              <div className="text-left">
                <p className="text-white font-medium">Mis Reservas</p>
                <p className="text-green-200 text-sm">Gestionar reservas</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard/reportes-cliente')}
              className="flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <span className="text-xl">📝</span>
              <div className="text-left">
                <p className="text-white font-medium">Mis Reportes</p>
                <p className="text-purple-200 text-sm">Ver mis reportes</p>
              </div>
            </button>
          </div>
        </div>

        {/* Historial Reciente (simulado) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-gray-300 text-sm">Reserva completada</p>
                  <p className="text-gray-500 text-xs">Espacio B5 - Hace 2 días</p>
                </div>
              </div>
              <span className="text-green-400 text-sm">✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-gray-300 text-sm">Nueva reserva creada</p>
                  <p className="text-gray-500 text-xs">Espacio A3 - Hace 1 semana</p>
                </div>
              </div>
              <span className="text-blue-400 text-sm">📅</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-gray-300 text-sm">Perfil actualizado</p>
                  <p className="text-gray-500 text-xs">Hace 2 semanas</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardCliente;
