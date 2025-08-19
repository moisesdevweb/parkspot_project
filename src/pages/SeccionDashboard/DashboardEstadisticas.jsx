import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DasboardGeneral/DashboardLayout';
import StatsCard from '../../components/DasboardGeneral/StatsCard';
import CircularProgress from '../../components/DasboardGeneral/CircularProgress';
import Loader from '../../components/DasboardGeneral/Loader';
import { authFetch, clearAuth, getUser } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardEstadisticas = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isAdmin = (user?.roles || []).some(r => (r?.name ?? r) === "ROLE_ADMIN");

  useEffect(() => {
    cargarEstadisticas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/api/dashboard/estadisticas' : '/api/dashboard/estadisticas-vigilante';
      const res = await authFetch(endpoint);
      
      if (!res.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const data = await res.json();
      setEstadisticas(data);
    } catch (error) {
      toast.error('Error al cargar las estadísticas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

  // Renderizado para Admin
  if (isAdmin) {
    const { espacios, registros, reservas } = estadisticas;
    
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
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p className="text-gray-400">Resumen general del sistema de estacionamiento</p>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Espacios Totales"
              value={espacios.total}
              subtitle="Total configurado"
              icon="🅿️"
              color="blue"
            />
            <StatsCard
              title="Espacios Ocupados"
              value={espacios.ocupados}
              subtitle={`${espacios.porcentajeOcupacion.toFixed(1)}% ocupación`}
              icon="🚗"
              color="red"
            />
            <StatsCard
              title="Registros Activos"
              value={registros.activos}
              subtitle={`${registros.total} total`}
              icon="📝"
              color="green"
            />
            <StatsCard
              title="Reservas Pendientes"
              value={reservas.pendientes}
              subtitle="Por confirmar"
              icon="⏰"
              color="yellow"
            />
          </div>

          {/* Sección de Análisis Detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estado de Espacios */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Estado de Espacios</h3>
              <div className="flex items-center justify-center mb-6">
                <CircularProgress 
                  percentage={espacios.porcentajeOcupacion} 
                  color="red"
                  size={140}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Disponibles</span>
                  </div>
                  <p className="text-white text-lg font-bold">{espacios.disponibles}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Ocupados</span>
                  </div>
                  <p className="text-white text-lg font-bold">{espacios.ocupados}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Reservados</span>
                  </div>
                  <p className="text-white text-lg font-bold">{espacios.reservados}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Mantenimiento</span>
                  </div>
                  <p className="text-white text-lg font-bold">{espacios.mantenimiento}</p>
                </div>
              </div>
            </div>

            {/* Estado de Reservas */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Gestión de Reservas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Pendientes</span>
                  </div>
                  <span className="text-white font-bold">{reservas.pendientes}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Confirmadas</span>
                  </div>
                  <span className="text-white font-bold">{reservas.confirmadas}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Utilizadas</span>
                  </div>
                  <span className="text-white font-bold">{reservas.utilizadas}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Canceladas</span>
                  </div>
                  <span className="text-white font-bold">{reservas.canceladas}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/dashboard/gestion-espacios')}
                className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <span className="text-xl">🏗️</span>
                <div className="text-left">
                  <p className="text-white font-medium">Gestionar Espacios</p>
                  <p className="text-blue-200 text-sm">Crear y editar</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard/estacionamiento')}
                className="flex items-center gap-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <span className="text-xl">🚗</span>
                <div className="text-left">
                  <p className="text-white font-medium">Estacionamiento</p>
                  <p className="text-green-200 text-sm">Tiempo real</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard/gestionar-clientes')}
                className="flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <span className="text-xl">👥</span>
                <div className="text-left">
                  <p className="text-white font-medium">Clientes</p>
                  <p className="text-purple-200 text-sm">Gestionar usuarios</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard/reportes')}
                className="flex items-center gap-3 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <span className="text-xl">📊</span>
                <div className="text-left">
                  <p className="text-white font-medium">Reportes</p>
                  <p className="text-orange-200 text-sm">Ver informes</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Renderizado para Vigilante
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Vigilante</h1>
          <p className="text-gray-400">Estado actual del estacionamiento</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Espacios Disponibles"
            value={estadisticas.espaciosDisponibles}
            subtitle="Listos para usar"
            icon="🟢"
            color="green"
          />
          <StatsCard
            title="Espacios Ocupados"
            value={estadisticas.espaciosOcupados}
            subtitle="Actualmente en uso"
            icon="🔴"
            color="red"
          />
          <StatsCard
            title="Registros Activos"
            value={estadisticas.registrosActivos}
            subtitle="Vehículos dentro"
            icon="📝"
            color="blue"
          />
          <StatsCard
            title="Reservas Pendientes"
            value={estadisticas.reservasPendientes}
            subtitle="Por procesar"
            icon="⏰"
            color="yellow"
          />
        </div>

        {/* Gráfico de Ocupación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Estado del Estacionamiento</h3>
            <div className="flex items-center justify-center mb-6">
              <CircularProgress 
                percentage={estadisticas.espaciosOcupados > 0 ? 
                  (estadisticas.espaciosOcupados / (estadisticas.espaciosDisponibles + estadisticas.espaciosOcupados)) * 100 : 0
                } 
                color="red"
                size={140}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">Disponibles</span>
                </div>
                <p className="text-white text-lg font-bold">{estadisticas.espaciosDisponibles}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">Ocupados</span>
                </div>
                <p className="text-white text-lg font-bold">{estadisticas.espaciosOcupados}</p>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas para Vigilante */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard/estacionamiento')}
                className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <span className="text-xl">🚗</span>
                <div className="text-left">
                  <p className="text-white font-medium">Gestionar Estacionamiento</p>
                  <p className="text-blue-200 text-sm">Asignar espacios y registrar salidas</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard/gestionar-reservas')}
                className="w-full flex items-center gap-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <span className="text-xl">📋</span>
                <div className="text-left">
                  <p className="text-white font-medium">Ver Reservas</p>
                  <p className="text-green-200 text-sm">Gestionar reservas pendientes</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard/reportes-vigilante')}
                className="w-full flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <span className="text-xl">📊</span>
                <div className="text-left">
                  <p className="text-white font-medium">Crear Reportes</p>
                  <p className="text-purple-200 text-sm">Informar incidencias</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEstadisticas;
